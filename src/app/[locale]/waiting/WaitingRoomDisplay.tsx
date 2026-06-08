"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Clock, FlaskConical } from "lucide-react";

interface Appointment {
  id: string; queueNumber: number | null; arrivalStatus: string;
  holdReason?: string | null;
  patient: { name: string; nameAr: string | null; };
  type: string;
}

interface RoomData {
  waiting: Appointment[];
  called?: Appointment | null;
  withDoctor?: Appointment | null;
  onHold?: Appointment[];
  done: Appointment[];
  pending: Appointment[];
  total: number;
}

export default function WaitingRoomDisplay({ roomData, doctor, locale }: {
  roomData: RoomData; doctor: any; locale: string; doctorId: string;
}) {
  const router = useRouter();
  const ar = locale === "ar";
  const [time, setTime] = useState<Date | null>(null);
  const [blink, setBlink] = useState(true);

  // Auto-refresh every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => router.refresh(), 2000);
    return () => clearInterval(interval);
  }, [router]);

  // Clock
  useEffect(() => {
    setTime(new Date());
    const tick = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // Blink for called patient
  useEffect(() => {
    if (!roomData.called) { setBlink(true); return; }
    const t = setInterval(() => setBlink(b => !b), 700);
    return () => clearInterval(t);
  }, [roomData.called]);

  const timeStr = time ? time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "--:--";
  const dateStr = time ? time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  const typeLabel: Record<string, string> = {
    consultation: ar ? "استشارة" : "Consultation",
    followUp: ar ? "متابعة" : "Follow-up",
    emergency: ar ? "طارئ" : "Emergency",
    procedure: ar ? "إجراء" : "Procedure",
  };

  const activeCalled  = roomData.called;
  const activeWithDoc = roomData.withDoctor;
  const onHold        = roomData.onHold ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white" dir={ar ? "rtl" : "ltr"}>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-8 py-5 bg-black/20">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/50">
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

        {/* ── CALLED — blinking ── */}
        {activeCalled && (
          <div className={`rounded-3xl border-4 p-8 text-center transition-all duration-300 ${
            blink ? "border-yellow-400 bg-yellow-500/15 shadow-2xl shadow-yellow-900/30" : "border-yellow-300/40 bg-yellow-500/8"
          }`}>
            <p className={`text-xl font-bold mb-4 flex items-center justify-center gap-3 ${blink ? "text-yellow-300" : "text-yellow-200/70"}`}>
              <span className={`h-4 w-4 rounded-full bg-yellow-400 transition-all ${blink ? "opacity-100 scale-125" : "opacity-40 scale-100"}`} />
              {ar ? "يُرجى التوجه لغرفة الطبيب" : "Please Proceed to Doctor's Room"}
            </p>
            <div className="flex items-center justify-center gap-10">
              <div>
                <p className="text-sm text-yellow-300/70">{ar ? "رقم الدور" : "Queue"}</p>
                <p className={`text-[110px] font-black leading-none ${blink ? "text-yellow-300" : "text-yellow-200/70"}`}>
                  {activeCalled.queueNumber}
                </p>
              </div>
              <div className="h-24 w-0.5 bg-yellow-400/20" />
              <div className="text-start">
                <p className="text-sm text-yellow-300/70 mb-2">{ar ? "المريض" : "Patient"}</p>
                <p className="text-4xl font-bold text-white">{activeCalled.patient.name}</p>
                {activeCalled.patient.nameAr && (
                  <p className="text-2xl text-yellow-200/70 mt-1">{activeCalled.patient.nameAr}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── WITH DOCTOR — steady ── */}
        {activeWithDoc && !activeCalled && (
          <div className="rounded-3xl bg-gradient-to-r from-blue-700/80 to-indigo-700/80 border border-blue-500/30 p-8 text-center">
            <p className="text-base text-blue-200 flex items-center justify-center gap-2 mb-4">
              <span className="h-3 w-3 rounded-full bg-green-400 animate-pulse" />
              {ar ? "يتم الكشف الآن" : "Currently in session"}
            </p>
            <div className="flex items-center justify-center gap-10">
              <div>
                <p className="text-sm text-blue-300/70">{ar ? "رقم الدور" : "Queue"}</p>
                <p className="text-[100px] font-black leading-none text-white">{activeWithDoc.queueNumber}</p>
              </div>
              <div className="h-20 w-0.5 bg-white/15" />
              <div className="text-start">
                <p className="text-4xl font-bold">{activeWithDoc.patient.name}</p>
                {activeWithDoc.patient.nameAr && (
                  <p className="text-2xl text-blue-200/70 mt-1">{activeWithDoc.patient.nameAr}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── NO ACTIVE PATIENT ── */}
        {!activeCalled && !activeWithDoc && (
          <div className="rounded-3xl bg-white/5 border border-white/10 p-12 text-center">
            <Stethoscope className="h-12 w-12 mx-auto mb-3 text-white/20" />
            <p className="text-2xl text-white/30">{ar ? "لا يوجد مريض حالياً" : "No patient currently"}</p>
          </div>
        )}

        {/* ── WAITING QUEUE ── */}
        <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10">
            <Clock className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-amber-300">
              {ar ? "في الانتظار" : "Waiting"} — {roomData.waiting.length}
            </h2>
          </div>
          {roomData.waiting.length === 0 ? (
            <p className="px-6 py-10 text-center text-white/25 text-xl">{ar ? "لا أحد في الانتظار" : "Nobody waiting"}</p>
          ) : (
            <div className="divide-y divide-white/5">
              {roomData.waiting.map(apt => (
                <div key={apt.id} className="flex items-center gap-5 px-6 py-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-2xl font-black">
                    {apt.queueNumber}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{apt.patient.name}</p>
                    {apt.patient.nameAr && <p className="text-sm text-white/40">{apt.patient.nameAr}</p>}
                  </div>
                  <span className="ms-auto rounded-full bg-white/8 px-3 py-1 text-xs text-white/50">
                    {typeLabel[apt.type] ?? apt.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── ON HOLD – only show if there are patients ── */}
        {onHold.length > 0 && (
          <div className="rounded-2xl bg-orange-500/8 border border-orange-500/20 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-orange-500/15">
              <FlaskConical className="h-5 w-5 text-orange-400" />
              <h2 className="text-base font-bold text-orange-300">
                {ar ? "في فحص خارجي" : "External Test"} — {onHold.length}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 px-6 py-4">
              {onHold.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 rounded-xl bg-orange-500/10 border border-orange-500/20 px-4 py-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-300 font-black text-sm">
                    {apt.queueNumber}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{apt.patient.name}</p>
                    <p className="text-xs text-orange-400/70">{apt.holdReason ?? (ar ? "فحص" : "Test")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-white/15">
          {ar ? "يتجدد كل ثانيتين" : "Refreshes every 2 seconds"} — ClinicPro
        </p>
      </div>
    </div>
  );
}
