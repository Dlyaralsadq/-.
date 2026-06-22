"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generatePatientNumber(): string {
  const ts = Date.now().toString().slice(-6);
  return `ONL-${ts}`;
}

function generateAppointmentNumber(): string {
  const ts = Date.now().toString().slice(-7);
  return `APT-ONL-${ts}`;
}

export async function createOnlineBooking(data: {
  doctorId: string;
  patientName: string;
  patientNameAr: string;
  phone: string;
  date: string;       // ISO date string
  time: string;       // "HH:MM"
  reason: string;
  locale: string;
}): Promise<{ success: boolean; error?: string; appointmentNumber?: string }> {

  // 1. Verify doctor exists and is active with valid subscription
  const now = new Date();
  const sub = await prisma.doctorSubscription.findFirst({
    where: { doctorId: data.doctorId, expiresAt: { gt: now } },
  });
  const doctor = await prisma.doctor.findFirst({
    where: { id: data.doctorId, isActive: true },
  });

  if (!sub || !doctor) {
    return { success: false, error: "doctor_unavailable" };
  }

  // 2. Parse requested date+time
  const [year, month, day] = data.date.split("-").map(Number);
  const [hour, minute] = data.time.split(":").map(Number);
  const appointmentDate = new Date(year, month - 1, day, hour, minute);

  if (isNaN(appointmentDate.getTime()) || appointmentDate < new Date()) {
    return { success: false, error: "invalid_date" };
  }

  // 3. Check slot availability (no appointment within 30 min window)
  const windowStart = new Date(appointmentDate.getTime() - 15 * 60 * 1000);
  const windowEnd   = new Date(appointmentDate.getTime() + 15 * 60 * 1000);

  const conflict = await prisma.appointment.findFirst({
    where: {
      doctorId: data.doctorId,
      status: { notIn: ["cancelled"] },
      date: { gte: windowStart, lte: windowEnd },
    },
  });

  if (conflict) {
    return { success: false, error: "slot_taken" };
  }

  // 4. Find or create patient record
  let patient = await prisma.patient.findFirst({
    where: { phone: data.phone, doctorId: data.doctorId },
  });

  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        patientNumber: generatePatientNumber(),
        name: data.patientName || data.patientNameAr,
        nameAr: data.patientNameAr || data.patientName,
        gender: "unknown",
        phone: data.phone,
        doctorId: data.doctorId,
      },
    });
  }

  // 5. Create appointment — isolated to this doctor
  const aptNum = generateAppointmentNumber();
  await prisma.appointment.create({
    data: {
      appointmentNumber: aptNum,
      patientId: patient.id,
      doctorId: data.doctorId,
      date: appointmentDate,
      duration: 30,
      type: "consultation",
      status: "scheduled",
      arrivalStatus: "pending",
      reason: data.reason,
      source: "online",
      patientPhone: data.phone,
    },
  });

  revalidatePath(`/[locale]/secretary`);
  revalidatePath(`/[locale]/doctor`);

  return { success: true, appointmentNumber: aptNum };
}
