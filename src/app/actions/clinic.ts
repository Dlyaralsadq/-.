"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { generateId } from "@/lib/utils";

// ─── Queue / Arrival ───────────────────────────────────────────
export async function getTodayQueue(doctorId: string) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: { doctorId, date: { gte: start, lte: end } },
    include: { patient: true },
    orderBy: [{ queueNumber: "asc" }, { date: "asc" }],
  });
}

export async function checkInPatient(appointmentId: string, doctorId: string) {
  // Get max queue number for today
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);

  const maxQueue = await prisma.appointment.aggregate({
    where: { doctorId, date: { gte: start, lte: end }, queueNumber: { not: null } },
    _max: { queueNumber: true },
  });

  const nextQueue = (maxQueue._max.queueNumber ?? 0) + 1;

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { arrivalStatus: "arrived", queueNumber: nextQueue, status: "confirmed" },
  });

  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true, queueNumber: nextQueue };
}

export async function callNextPatient(doctorId: string) {
  // Mark current "with_doctor" or "called" as done
  await prisma.appointment.updateMany({
    where: { doctorId, arrivalStatus: { in: ["with_doctor", "called"] } },
    data: { arrivalStatus: "done", status: "completed" },
  });

  // Prioritize returnedFromTest patients, then by queue number
  const next = await prisma.appointment.findFirst({
    where: { doctorId, arrivalStatus: "arrived" },
    orderBy: [{ returnedFromTest: "desc" }, { queueNumber: "asc" }],
    include: { patient: true },
  });

  if (next) {
    await prisma.appointment.update({
      where: { id: next.id },
      data: { arrivalStatus: "called" },
    });
  }

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true, next };
}

export async function confirmPatientEntry(appointmentId: string, doctorId: string) {
  const apt = await prisma.appointment.findFirst({
    where: { id: appointmentId, doctorId, arrivalStatus: "called" },
  });
  if (!apt) return { success: false };

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { arrivalStatus: "with_doctor" },
  });

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true };
}

export async function updateDiagnosis(appointmentId: string, doctorId: string, data: {
  diagnosis?: string; prescription?: string; notes?: string;
}) {
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { ...data, arrivalStatus: "done", status: "completed" },
  });

  revalidatePath("/[locale]/doctor", "page");
  return { success: true };
}

// ─── Quick Booking (Secretary) ─────────────────────────────────
export async function quickBookAppointment(doctorId: string, data: {
  patientName: string;
  patientPhone: string;
  patientGender: string;
  patientNameAr?: string;
  date: string;
  time: string;
  type?: string;
  reason?: string;
  notes?: string;
  existingPatientId?: string;
}) {
  let patientId = data.existingPatientId;

  if (!patientId) {
    // Auto-create patient
    const patientNumber = generateId("P");
    const patient = await prisma.patient.create({
      data: {
        name: data.patientName,
        nameAr: data.patientNameAr,
        phone: data.patientPhone,
        gender: data.patientGender,
        patientNumber,
        doctorId,
      },
    });
    patientId = patient.id;
  }

  const appointmentNumber = generateId("APT");
  const dateTime = new Date(`${data.date}T${data.time}:00`);

  await prisma.appointment.create({
    data: {
      appointmentNumber,
      patientId,
      doctorId,
      date: dateTime,
      duration: 30,
      type: data.type ?? "consultation",
      status: "scheduled",
      reason: data.reason,
      notes: data.notes,
    },
  });

  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/doctor", "page");
  return { success: true };
}

export async function getSecretaryDoctorId(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.linkedDoctorId ?? null;
}

export async function getDoctorForDisplay(doctorId: string) {
  return prisma.doctor.findUnique({
    where: { id: doctorId },
    include: { specialty: true },
  });
}

export async function getWaitingRoomData(doctorId: string) {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: { doctorId, date: { gte: start, lte: end }, status: { not: "completed" } },
    include: { patient: true },
    orderBy: [{ queueNumber: "asc" }, { date: "asc" }],
  });

  const waiting    = appointments.filter(a => a.arrivalStatus === "arrived");
  const called     = appointments.find(a => a.arrivalStatus === "called");
  const withDoctor = appointments.find(a => a.arrivalStatus === "with_doctor");
  const onHold     = appointments.filter(a => a.arrivalStatus === "on_hold");
  const pending    = appointments.filter(a => a.arrivalStatus === "pending");

  return { waiting, called, withDoctor, onHold, done: [], pending, total: appointments.length };
}

export async function markPayment(appointmentId: string, doctorId: string, isPaid: boolean) {
  const apt = await prisma.appointment.findFirst({ where: { id: appointmentId, doctorId } });
  if (!apt) return { success: false };
  await prisma.appointment.update({ where: { id: appointmentId }, data: { isPaid } });
  revalidatePath("/[locale]/secretary", "page");
  return { success: true };
}

export async function completeAppointment(appointmentId: string, doctorId: string, data?: {
  diagnosis?: string; prescription?: string; notes?: string;
}) {
  const apt = await prisma.appointment.findFirst({ where: { id: appointmentId, doctorId } });
  if (!apt) return { success: false };
  
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      ...data,
      arrivalStatus: "done",
      status: "completed",
      completedAt: new Date(),
    },
  });

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true };
}

export async function getAllAppointmentsForArchive(doctorId: string) {
  const [completed, pending] = await Promise.all([
    prisma.appointment.findMany({
      where: { doctorId, status: "completed" },
      include: { patient: true },
      orderBy: { completedAt: "desc" },
    }),
    prisma.appointment.findMany({
      where: { doctorId, status: { not: "completed" } },
      include: { patient: true },
      orderBy: { date: "asc" },
    }),
  ]);
  return { completed, pending };
}

export async function getCompletedAppointments(doctorId: string) {
  return prisma.appointment.findMany({
    where: { doctorId, status: "completed" },
    include: { patient: true },
    orderBy: { completedAt: "desc" },
    take: 50,
  });
}

export async function getTodaySyncedQueue(doctorId: string) {
  // Returns today's appointments for live queue management
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);

  return prisma.appointment.findMany({
    where: { doctorId, date: { gte: start, lte: end }, status: { not: "completed" } },
    include: { patient: true },
    orderBy: [{ queueNumber: "asc" }, { date: "asc" }],
  });
}

export async function getAllUpcomingAppointments(doctorId: string) {
  // Returns ALL non-completed appointments ordered by date
  const start = new Date(); start.setHours(0, 0, 0, 0);

  return prisma.appointment.findMany({
    where: { doctorId, date: { gte: start }, status: { not: "completed" } },
    include: { patient: true },
    orderBy: { date: "asc" },
  });
}

// ── Hold for Test ──────────────────────────────────────────────
export async function holdPatientForTest(appointmentId: string, doctorId: string, holdReason: string) {
  const apt = await prisma.appointment.findFirst({ where: { id: appointmentId, doctorId, arrivalStatus: "with_doctor" } });
  if (!apt) return { success: false };

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { arrivalStatus: "on_hold", holdReason },
  });

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true };
}

export async function patientReturnedFromTest(appointmentId: string, doctorId: string) {
  const apt = await prisma.appointment.findFirst({ where: { id: appointmentId, doctorId, arrivalStatus: "on_hold" } });
  if (!apt) return { success: false };

  // Find minimum queue number of current waiting patients to place before them
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);

  const firstWaiting = await prisma.appointment.findFirst({
    where: { doctorId, date: { gte: start, lte: end }, arrivalStatus: "arrived" },
    orderBy: { queueNumber: "asc" },
  });

  // Priority: place before the first waiting patient (use a lower queue number)
  // If nobody waiting, get next number after current max
  let priorityQueue: number;
  if (firstWaiting?.queueNumber && firstWaiting.queueNumber > 1) {
    // Shift all current waiting patients up by 1, then take the first waiting slot
    await prisma.appointment.updateMany({
      where: { doctorId, date: { gte: start, lte: end }, arrivalStatus: "arrived" },
      data: { queueNumber: { increment: 1 } },
    });
    priorityQueue = firstWaiting.queueNumber; // now the slot is free
  } else {
    // No one waiting or queue is at 1; find next available number
    const maxQueue = await prisma.appointment.aggregate({
      where: { doctorId, date: { gte: start, lte: end }, queueNumber: { not: null } },
      _max: { queueNumber: true },
    });
    priorityQueue = (maxQueue._max.queueNumber ?? 0) + 1;
  }

  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { arrivalStatus: "arrived", holdReason: null, queueNumber: priorityQueue, returnedFromTest: true },
  });

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true };
}

export async function callOnHoldPatient(appointmentId: string, doctorId: string) {
  // Mark current with_doctor or called as done first
  await prisma.appointment.updateMany({
    where: { doctorId, arrivalStatus: { in: ["with_doctor", "called"] } },
    data: { arrivalStatus: "done", status: "completed", completedAt: new Date() },
  });

  // Set on_hold patient to called directly
  await prisma.appointment.update({
    where: { id: appointmentId },
    data: { arrivalStatus: "called", holdReason: null, returnedFromTest: true },
  });

  revalidatePath("/[locale]/doctor", "page");
  revalidatePath("/[locale]/secretary", "page");
  revalidatePath("/[locale]/waiting", "page");
  return { success: true };
}
