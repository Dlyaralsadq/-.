"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Clock, CheckCircle2, Volume2 } from "lucide-react";

interface Appointment {
  id: string; queueNumber: number | null; arrivalStatus: string;
  patient: { name: string; nameAr: string | null; };
  type: string;
}

interface RoomData {
  waiting: Appointment[]; withDoctor: Appointment | null | undefined;
  done: Appointment[]; pending: Appointment[]; total: number;
}

export default function WaitingRoomDisplay({ roomData, doctor, locale, doctorId }: {
  roomData: RoomData; doctor: any; locale: string; doctorId: string;
}) {
  const router = useRouter();
  const ar = locale === "ar";
  const [time, setTime] = useState(new Date());
  const [justCalled, setJustCalled] = useState<number | null>(null);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 15000);
    return () => clearInterval(interval);
  }, [router]);

  // Update clock
  useEffect(() => {
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Detect when "with_doctor" changes and animate
  useEffect(() => {
    if (roomData.withDoctor?.queueNumber) {
      setJustCalled(roomData.withDoctor.queueNumber);
      const t = setTimeout(() => setJustCalled(null), 4000);
      return () => clearTimeout(t);
    }
  }, [roomData.withDoctor?.id]);

  const timeStr = time.toLocaleTimeString(ar ? "ar-SA" : "en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  const dateStr = time.toLocaleDateString(ar ? "ar-SA" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const typeLabel: Record<string, string> = {
    consultation: ar ? "استشارة" : "Consultation",
    followUp: ar ? "متابعة" : "Follow-up",
    emergency: ar ? "طارئ" : "Emergency",
    procedure: ar ? "إجراء" : "Procedure",
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white"
      dir={ar ? "rtl" : "ltr"}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-8 py-4 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-indigo-300 uppercase tracking-widest">{ar ? "عيادة" : "Clinic"}</p>
            <p className="text-lg font-bold text-white">{ar ? doctor.nameAr : doctor.name}</p>
            <p className="text-sm text-indigo-300">{ar ? doctor.specialty.nameAr : doctor.specialty.name}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-4xl font-black text-white tabular-nums">{timeStr}</p>
          <p className="text-sm text-indigo-300 mt-0.5">{dateStr}</p>
        </div>
      </div>

      <div className="p-8 space-y-8">

        {/* CURRENT PATIENT — BIG DISPLAY */}
        <div className={`rounded-3xl p-8 text-center transition-all duration-500 ${
          roomData.withDoctor
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-2xl shadow-blue-900/50 scale-100"
            : "bg-white/5 border border-white/10"
        }`}>
          {roomData.withDoctor ? (
            <>
              <p className="text-lg text-blue-200 mb-2 flex items-center justify-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse" />
                {ar ? "يُرجى توجه صاحب الدور إلى غرفة الطبيب" : "Please proceed to the doctor's room"}
              </p>
              <div className="flex items-center justify-center gap-6">
                <div>
                  <p className="text-sm text-blue-200">{ar ? "رقم الدور" : "Queue Number"}</p>
                  <p className={`text-9xl font-black leading-none ${justCalled === roomData.withDoctor.queueNumber ? "animate-bounce" : ""}`}>
                    {roomData.withDoctor.queueNumber}
                  </p>
                </div>
                <div className="h-24 w-px bg-white/20" />
                <div className="text-start">
                  <p className="text-sm text-blue-200 mb-1">{ar ? "المريض" : "Patient"}</p>
                  <p className="text-3xl font-bold">{roomData.withDoctor.patient.name}</p>
                  {roomData.withDoctor.patient.nameAr && (
                    <p className="text-xl text-blue-200 mt-1">{roomData.withDoctor.patient.nameAr}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="py-4">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Stethoscope className="h-8 w-8 text-white/40" />
              </div>
              <p className="text-xl text-white/40 font-medium">
                {ar ? "لا يوجد مريض حالياً" : "No current patient"}
              </p>
            </div>
          )}
        </div>

        {/* Two columns: Waiting + Done */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Waiting */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-amber-500/20 border-b border-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-amber-300">
                {ar ? "في الانتظار" : "Waiting"} — {roomData.waiting.length}
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {roomData.waiting.length === 0 ? (
                <p className="px-6 py-8 text-center text-white/30">
                  {ar ? "لا أحد في الانتظار" : "Nobody waiting"}
                </p>
              ) : roomData.waiting.map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-xl font-black">
                    {apt.queueNumber}
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">{apt.patient.name}</p>
                    {apt.patient.nameAr && <p className="text-sm text-white/50">{apt.patient.nameAr}</p>}
                  </div>
                  <div className="ms-auto">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                      {typeLabel[apt.type] ?? apt.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Done */}
          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-green-500/20 border-b border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-bold text-green-300">
                {ar ? "انتهوا" : "Completed"} — {roomData.done.length}
              </h2>
            </div>
            <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
              {roomData.done.length === 0 ? (
                <p className="px-6 py-8 text-center text-white/30">
                  {ar ? "لا أحد" : "None yet"}
                </p>
              ) : [...roomData.done].reverse().map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-6 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-white/70">{apt.patient.name}</p>
                  </div>
                  <div className="ms-auto rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs text-green-400 font-mono">
                    #{apt.queueNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-white/20">
          <p>{ar ? "يتجدد تلقائياً كل 15 ثانية" : "Auto-refreshes every 15 seconds"}</p>
          <p>ClinicPro — {ar ? "نظام إدارة العيادات" : "Clinic Management System"}</p>
        </div>
      </div>
    </div>
  );
}
