import { prisma } from "@/lib/prisma";
import { IRAQ_GOVERNORATES } from "@/lib/iraq";

export async function getPublicSpecialties() {
  return prisma.specialty.findMany({
    where: { isActive: true },
    orderBy: { nameAr: "asc" },
  });
}

export async function getListedDoctors(filters?: {
  specialtyId?: string;
  governorate?: string;
  district?: string;
  query?: string;
}) {
  const now = new Date();
  const subscriptions = await prisma.doctorSubscription.findMany({
    where: { expiresAt: { gt: now } },
    select: { doctorId: true },
  });
  const subscribedIds = subscriptions.map((s) => s.doctorId);
  if (subscribedIds.length === 0) return [];

  // Build location address filter (district takes priority over governorate)
  let addressFilter: { clinicAddress: { contains: string } } | undefined;
  if (filters?.district) {
    const gov = IRAQ_GOVERNORATES.find((g) => g.id === filters.governorate);
    const d = gov?.districts.find((d) => d.id === filters.district);
    if (d) addressFilter = { clinicAddress: { contains: d.ar } };
  } else if (filters?.governorate) {
    const gov = IRAQ_GOVERNORATES.find((g) => g.id === filters.governorate);
    if (gov) addressFilter = { clinicAddress: { contains: gov.ar } };
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
