import { prisma } from "@iraq-clinic/database";

export async function getSpecialties() {
  return prisma.specialty.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
  });
}

export async function getListedDoctors(filters?: {
  specialtyId?: string;
  query?: string;
}) {
  const now = new Date();

  const subscriptions = await prisma.doctorSubscription.findMany({
    where: { expiresAt: { gt: now } },
    select: { doctorId: true },
  });
  const subscribedIds = subscriptions.map((s) => s.doctorId);

  if (subscribedIds.length === 0) {
    return [];
  }

  return prisma.doctor.findMany({
    where: {
      isActive: true,
      id: { in: subscribedIds },
      ...(filters?.specialtyId ? { specialtyId: filters.specialtyId } : {}),
      ...(filters?.query
        ? {
            OR: [
              { name: { contains: filters.query } },
              { nameAr: { contains: filters.query } },
              { clinicAddress: { contains: filters.query } },
            ],
          }
        : {}),
    },
    include: {
      specialty: true,
      _count: { select: { appointments: true } },
    },
    orderBy: { nameAr: "asc" },
  });
}

export async function getDoctorById(id: string) {
  const now = new Date();
  const subscription = await prisma.doctorSubscription.findFirst({
    where: { doctorId: id, expiresAt: { gt: now } },
  });

  if (!subscription) return null;

  return prisma.doctor.findFirst({
    where: { id, isActive: true },
    include: { specialty: true },
  });
}
