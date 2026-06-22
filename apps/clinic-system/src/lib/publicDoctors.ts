import { prisma } from "@/lib/prisma";
import { GOVERNORATES } from "@/lib/iraq";

export async function getPublicSpecialties() {
  return prisma.specialty.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
  });
}

export async function getListedDoctors(filters?: {
  specialtyId?: string;
  governorate?: string;
  query?: string;
}) {
  const now = new Date();
  const subscriptions = await prisma.doctorSubscription.findMany({
    where: { expiresAt: { gt: now } },
    select: { doctorId: true },
  });
  const subscribedIds = subscriptions.map((s) => s.doctorId);
  if (subscribedIds.length === 0) return [];

  // Build governorate address filter
  let addressFilter: { clinicAddress: { contains: string } } | undefined;
  if (filters?.governorate) {
    const gov = GOVERNORATES.find((g) => g.id === filters.governorate);
    if (gov) {
      addressFilter = { clinicAddress: { contains: gov.ar } };
    }
  }

  return prisma.doctor.findMany({
    where: {
      isActive: true,
      id: { in: subscribedIds },
      ...(filters?.specialtyId ? { specialtyId: filters.specialtyId } : {}),
      ...(addressFilter ?? {}),
      ...(filters?.query
        ? {
            OR: [
              { name:          { contains: filters.query } },
              { nameAr:        { contains: filters.query } },
              { clinicAddress: { contains: filters.query } },
            ],
          }
        : {}),
    },
    include: { specialty: true },
    orderBy: { nameAr: "asc" },
  });
}

export async function getPublicDoctorById(id: string) {
  const now = new Date();
  const sub = await prisma.doctorSubscription.findFirst({
    where: { doctorId: id, expiresAt: { gt: now } },
  });
  if (!sub) return null;
  return prisma.doctor.findFirst({
    where: { id, isActive: true },
    include: { specialty: true },
  });
}
