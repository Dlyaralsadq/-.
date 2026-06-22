import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "doctor") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { doctorId, logoUrl, logoBackground, logoBgOnDoctor, logoBgOnSecretary, logoBgOnWaiting } = await request.json();

  await prisma.doctor.update({
    where: { id: doctorId },
    data: {
      ...(logoUrl !== undefined ? { logoUrl } : {}),
      ...(logoBackground !== undefined ? { logoBackground } : {}),
      ...(logoBgOnDoctor !== undefined ? { logoBgOnDoctor } : {}),
      ...(logoBgOnSecretary !== undefined ? { logoBgOnSecretary } : {}),
      ...(logoBgOnWaiting !== undefined ? { logoBgOnWaiting } : {}),
    },
  });

  return NextResponse.json({ success: true });
}
