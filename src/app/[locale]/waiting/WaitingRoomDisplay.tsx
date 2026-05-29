"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Clock, CheckCircle2, ArrowBigRight } from "lucide-react";

interface Appointment {
  id: string; queueNumber: number | null; arrivalStatus: string;
  patient: { name: string; nameAr: string | null; };
  type: string;
}

interface RoomData {
  waiting: Appointment[];
  called?: Appointment | null;
  withDoctor?: Appointment | null;
  done: Appointment[];
  pending: Appointment[];
  total: number;
}

export default function WaitingRoomDisplay({ roomData, doctor, locale, doctorId }: {
  roomData: RoomData; doctor: any; locale: string; doctorId: string;
}) {
  const router = useRouter();
  const ar = locale === "ar";
  const [time, setTime] = useState<Date | null>(null);
  const [blink, setBlink] = useState(true);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 10000);
    return () => clearInterval(interval);
  }, [router]);

  // Clock — runs only on client to avoid hydration mismatch
  useEffect(() => {
    setTime(new Date());
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Blink toggle for called patient
  useEffect(() => {
    if (!roomData.called) return;
    const t = setInterval(() => setBlink(b => !b), 700);
    return () => clearInterval(t);
  }, [roomData.called]);

  const timeStr = time ? time.toLocaleTimeString(ar ? "ar-SA" : "en-US", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const dateStr = time ? time.toLocaleDateString(ar ? "ar-SA" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }) : "";

  const typeLabel: Record<string, string> = {
    consultation: ar ? "استشارة" : "Consultation",
    followUp: ar ? "متابعة" : "Follow-up",
    emergency: ar ? "طارئ" : "Emergency",
    procedure: ar ? "إجراء" : "Procedure",
  };

  const activeCalled = roomData.called;
  const activeWithDoctor = roomData.withDoctor;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white" dir={ar ? "rtl" : "ltr"}>

      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/10 px-8 py-5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-900/50">
            <Stethoscope className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-0.5">{ar ? "عيادة" : "Clinic"}</p>
            <p className="text-xl font-bold">{ar ? doctor.nameAr : doctor.name}</p>
            <p className="text-sm text-indigo-300">{ar ? doctor.specialty.nameAr : doctor.specialty.name}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-5xl font-black tabular-nums">{timeStr}</p>
          <p className="text-sm text-indigo-300 mt-1">{dateStr}</p>
        </div>
      </div>

      <div className="p-8 space-y-6">

        {/* ── CALLED PATIENT — blinking alert ── */}
        {activeCalled && (
          <div className={`rounded-3xl border-4 p-8 text-center transition-all duration-300 ${
            blink
              ? "border-yellow-400 bg-yellow-500/20 shadow-2xl shadow-yellow-500/30"
              : "border-yellow-300/50 bg-yellow-500/10"
          }`}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className={`inline-block h-4 w-4 rounded-full bg-yellow-400 ${blink ? "opacity-100 scale-125" : "opacity-50 scale-100"} transition-all duration-300`} />
              <p className={`text-xl font-bold ${blink ? "text-yellow-300" : "text-yellow-200"} transition-colors duration-300`}>
                {ar ? "يُرجى التوجه لغرفة الطبيب" : "Please Proceed to Doctor's Room"}
              </p>
              <ArrowBigRight className={`h-6 w-6 ${blink ? "text-yellow-400 translate-x-2" : "text-yellow-300"} transition-all duration-300 rtl:rotate-180`} />
            </div>
            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-sm text-yellow-300 mb-1">{ar ? "رقم الدور" : "Queue Number"}</p>
                <p className={`text-[120px] font-black leading-none ${blink ? "text-yellow-300" : "text-yellow-200"} transition-colors`}>
                  {activeCalled.queueNumber}
                </p>
              </div>
              <div className="h-28 w-0.5 bg-yellow-400/30" />
              <div className="text-start">
                <p className="text-sm text-yellow-300 mb-2">{ar ? "المريض" : "Patient"}</p>
                <p className="text-4xl font-bold text-white">{activeCalled.patient.name}</p>
                {activeCalled.patient.nameAr && (
                  <p className="text-2xl text-yellow-200 mt-1">{activeCalled.patient.nameAr}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── WITH DOCTOR — steady green ── */}
        {activeWithDoctor && !activeCalled && (
          <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center shadow-2xl shadow-blue-900/40">
            <p className="text-base text-blue-200 flex items-center justify-center gap-2 mb-4">
              <span className="inline-block h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              {ar ? "يتم الكشف الآن" : "Currently in session"}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div>
                <p className="text-sm text-blue-200 mb-1">{ar ? "رقم الدور" : "Queue #"}</p>
                <p className="text-[100px] font-black leading-none">{activeWithDoctor.queueNumber}</p>
              </div>
              <div className="h-24 w-0.5 bg-white/20" />
              <div className="text-start">
                <p className="text-sm text-blue-200 mb-2">{ar ? "المريض" : "Patient"}</p>
                <p className="text-4xl font-bold">{activeWithDoctor.patient.name}</p>
                {activeWithDoctor.patient.nameAr && (
                  <p className="text-2xl text-blue-200 mt-1">{activeWithDoctor.patient.nameAr}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No active patient */}
        {!activeCalled && !activeWithDoctor && (
          <div className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
              <Stethoscope className="h-10 w-10 text-white/30" />
            </div>
            <p className="text-2xl text-white/30 font-medium">
              {ar ? "لا يوجد مريض حالياً" : "No patient currently"}
            </p>
          </div>
        )}

        {/* Waiting + Done columns */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-amber-500/15 border-b border-amber-500/20">
              <Clock className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-amber-300">
                {ar ? "في الانتظار" : "Waiting"} — {roomData.waiting.length}
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {roomData.waiting.length === 0 ? (
                <p className="px-6 py-10 text-center text-white/30 text-lg">
                  {ar ? "لا أحد في الانتظار" : "Nobody waiting"}
                </p>
              ) : roomData.waiting.map((apt) => (
                <div key={apt.id} className="flex items-center gap-5 px-6 py-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-2xl font-black">
                    {apt.queueNumber}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{apt.patient.name}</p>
                    {apt.patient.nameAr && <p className="text-sm text-white/50">{apt.patient.nameAr}</p>}
                  </div>
                  <span className="ms-auto rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                    {typeLabel[apt.type] ?? apt.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-green-500/15 border-b border-green-500/20">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <h2 className="text-lg font-bold text-green-300">
                {ar ? "انتهوا" : "Completed"} — {roomData.done.length}
              </h2>
            </div>
            <div className="divide-y divide-white/5 max-h-80 overflow-y-auto">
              {roomData.done.length === 0 ? (
                <p className="px-6 py-10 text-center text-white/30 text-lg">{ar ? "لا أحد" : "None yet"}</p>
              ) : [...roomData.done].reverse().map((apt) => (
                <div key={apt.id} className="flex items-center gap-4 px-6 py-3.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400" />
                  <p className="text-base text-white/70 font-medium">{apt.patient.name}</p>
                  <span className="ms-auto rounded-full bg-green-500/15 px-3 py-0.5 text-sm text-green-400 font-mono font-bold">
                    #{apt.queueNumber}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-white/20">
          {ar ? "يتجدد تلقائياً كل 10 ثوانٍ" : "Auto-refreshes every 10 seconds"} — ClinicPro
        </p>
      </div>
    </div>
  );
}
