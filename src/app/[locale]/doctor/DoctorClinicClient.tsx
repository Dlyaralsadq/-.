"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope, Users, ChevronRight, ClipboardList,
  CheckCircle2, Clock, FileText, Phone, Activity,
  PlayCircle, Monitor, Calendar, NotebookPen,
  AlertCircle, DoorOpen, CheckCheck, ArrowRight, Banknote
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { callNextPatient, confirmPatientEntry, completeAppointment } from "@/app/actions/clinic";
import { formatTime, formatDate } from "@/lib/utils";

interface Appointment {
  id: string; appointmentNumber: string; date: Date;
  type: string; status: string; arrivalStatus: string;
  queueNumber: number | null; reason: string | null; isPaid: boolean;
  diagnosis: string | null; prescription: string | null; notes: string | null;
  patient: { id: string; name: string; nameAr: string | null; phone: string; bloodType: string | null; };
}

const typeLabel = (type: string, ar: boolean) => ({
  consultation: ar ? "استشارة" : "Consultation",
  followUp: ar ? "متابعة" : "Follow-up",
  emergency: ar ? "طارئ" : "Emergency",
  procedure: ar ? "إجراء" : "Procedure",
}[type] ?? type);

export default function DoctorClinicClient({ doctor, queue, locale }: {
  doctor: any; queue: Appointment[]; locale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [consultOpen, setConsultOpen] = useState(false);
  const [activeApt, setActiveApt] = useState<Appointment | null>(null);
  const [saving, setSaving] = useState(false);

  const ar = locale === "ar";

  const called    = queue.find(a => a.arrivalStatus === "called");
  const current   = queue.find(a => a.arrivalStatus === "with_doctor");
  const waiting   = queue.filter(a => a.arrivalStatus === "arrived");
  const pending   = queue.filter(a => a.arrivalStatus === "pending");

  const act = (fn: () => Promise<unknown>) => {
    startTransition(async () => { await fn(); router.refresh(); });
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeApt) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await completeAppointment(activeApt.id, doctor.id, {
      diagnosis: fd.get("diagnosis") as string,
      prescription: fd.get("prescription") as string,
      notes: fd.get("notes") as string,
    });
    setSaving(false);
    setConsultOpen(false);
    router.refresh();
  };

  return (
    <div className="space-y-5">

      {/* Doctor banner */}
      <div className="rounded-2xl overflow-hidden border border-indigo-500/20">
        <div className="bg-gradient-to-r from-[#1e1b4b] via-[#1a1f5e] to-[#0f172a] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-white text-xl font-black">
                {doctor.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-white">{ar ? doctor.nameAr : doctor.name}</p>
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-xs text-indigo-300">
                    {ar ? doctor.specialty.nameAr : doctor.specialty.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ar ? "الانتظار:" : "Waiting:"} <strong className="text-amber-400">{waiting.length}</strong></span>
                  <span className="h-3 w-px bg-slate-700" />
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ar ? "اليوم:" : "Today:"} <strong className="text-white">{queue.length}</strong></span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link href={`/${locale}/secretary`}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition-colors">
                <ClipboardList className="h-3.5 w-3.5" />{ar ? "الاستقبال" : "Reception"}
              </Link>
              <Link href={`/${locale}/waiting?d=${doctor.id}`} target="_blank"
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 hover:bg-white/10 transition-colors">
                <Monitor className="h-3.5 w-3.5" />{ar ? "شاشة الانتظار" : "Waiting Screen"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">

        {/* LEFT col (3/5): active state */}
        <div className="space-y-4 lg:col-span-3">

          {/* Called patient */}
          {called && (
            <div className="card overflow-hidden border-yellow-500/30 glow-yellow animate-fade-up">
              <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-5 py-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-sm font-semibold text-yellow-300">{ar ? "تم النداء — بانتظار الدخول" : "Patient Called — Awaiting Entry"}</span>
                <span className="ms-auto text-xs font-bold text-yellow-400/70">#{called.queueNumber}</span>
              </div>
              <div className="p-5 flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-300 text-xl font-black">
                  {called.patient.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{called.patient.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1"><Phone className="h-3 w-3" />{called.patient.phone}</p>
                  {called.reason && <p className="text-xs text-amber-400/80 mt-1">{called.reason}</p>}
                </div>
                <Button variant="success" className="gap-1.5 shrink-0" onClick={() => act(() => confirmPatientEntry(called.id, doctor.id))} disabled={isPending}>
                  <DoorOpen className="h-4 w-4" />{ar ? "تأكيد الدخول" : "Confirm Entry"}
                </Button>
              </div>
            </div>
          )}

          {/* Current patient */}
          {current ? (
            <div className="card overflow-hidden">
              <div className="bg-blue-600/15 border-b border-blue-500/20 px-5 py-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400 animate-pulse" />
                <span className="text-sm font-semibold text-blue-300">{ar ? "المريض الحالي" : "Current Patient"}</span>
                <span className="ms-auto text-xs text-blue-400/60">#{current.queueNumber} · {formatTime(current.date, locale)}</span>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xl font-black shadow-lg shadow-blue-900/40">
                    {current.patient.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-bold text-white">{current.patient.name}</h2>
                      {current.patient.bloodType && (
                        <span className="rounded-md bg-red-500/15 border border-red-500/25 px-2 py-0.5 text-xs font-bold text-red-400">{current.patient.bloodType}</span>
                      )}
                      {!current.isPaid && (
                        <span className="rounded-md bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-xs font-medium text-amber-400 flex items-center gap-1">
                          <Banknote className="h-3 w-3" />{ar ? "لم يدفع" : "Unpaid"}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5"><Phone className="h-3.5 w-3.5" />{current.patient.phone}</p>
                    {current.reason && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/8 border border-amber-500/20 px-3 py-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <p className="text-sm text-amber-300/90">{current.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button className="flex-1 gap-2" onClick={() => { setActiveApt(current); setConsultOpen(true); }}>
                    <NotebookPen className="h-4 w-4" />{ar ? "تسجيل التشخيص وإنهاء الكشف" : "Record & Complete Consultation"}
                  </Button>
                  {waiting.length > 0 && (
                    <Button variant="outline" className="gap-1.5" onClick={() => act(() => callNextPatient(doctor.id))} disabled={isPending}>
                      <PlayCircle className="h-4 w-4" />{ar ? "التالي" : "Next"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : !called && (
            <div className="card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 border border-[#2a3347]">
                <Stethoscope className="h-8 w-8 text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium mb-1">
                {waiting.length > 0 ? (ar ? "اضغط لاستدعاء المريض التالي" : "Press to call next patient") : (ar ? "لا يوجد مرضى في الانتظار حالياً" : "No patients waiting")}
              </p>
              {waiting.length > 0 && (
                <Button size="lg" className="mt-4 gap-2" onClick={() => act(() => callNextPatient(doctor.id))} disabled={isPending} loading={isPending}>
                  <PlayCircle className="h-5 w-5" />
                  {ar ? `استدعاء المريض التالي (${waiting.length})` : `Call Next Patient (${waiting.length})`}
                </Button>
              )}
            </div>
          )}

          {/* Waiting queue */}
          {waiting.length > 0 && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2536]">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  {ar ? "قائمة الانتظار" : "Waiting Queue"}
                  <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-2 py-0.5 text-xs text-amber-400 font-bold">{waiting.length}</span>
                </h2>
                {!current && !called && (
                  <Button size="sm" className="gap-1.5" onClick={() => act(() => callNextPatient(doctor.id))} disabled={isPending}>
                    <PlayCircle className="h-3.5 w-3.5" />{ar ? "استدعاء" : "Call"}
                  </Button>
                )}
              </div>
              <div className="divide-y divide-[#1e2536]">
                {waiting.map((apt, i) => (
                  <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-400 font-black text-sm">
                      {apt.queueNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{apt.patient.name}</p>
                      <p className="text-xs text-slate-500">{apt.patient.phone}</p>
                    </div>
                    <div className="text-end shrink-0">
                      <p className="text-xs font-medium text-slate-300">{formatTime(apt.date, locale)}</p>
                      <p className="text-xs text-slate-600">{typeLabel(apt.type, ar)}</p>
                    </div>
                    {!apt.isPaid && <span title={ar ? "لم يدفع" : "Unpaid"}><Banknote className="h-4 w-4 text-amber-500/60" /></span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT col (2/5): pending + links */}
        <div className="space-y-4 lg:col-span-2">

          {/* Pending appointments */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#1e2536]">
              <Calendar className="h-4 w-4 text-slate-500" />
              <h2 className="text-sm font-semibold text-white">{ar ? "لم يصلوا بعد" : "Not Yet Arrived"}</h2>
              <span className="ms-auto rounded-full bg-slate-700/60 px-2 py-0.5 text-xs text-slate-400 font-medium">{pending.length}</span>
            </div>
            <div className="divide-y divide-[#1e2536] max-h-64 overflow-y-auto">
              {pending.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-slate-600">{ar ? "الجميع وصل" : "All arrived"}</p>
              ) : pending.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800/60 text-slate-500 text-xs font-semibold">
                    {apt.patient.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{apt.patient.name}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-600 font-mono">{formatTime(apt.date, locale)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <Modal isOpen={consultOpen} onClose={() => setConsultOpen(false)}
        title={ar ? "تسجيل الكشف الطبي وإنهاؤه" : "Record & Complete Consultation"} size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setConsultOpen(false)} disabled={saving}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="consult-form" loading={saving} variant="success">
            <CheckCheck className="h-4 w-4" />{ar ? "إنهاء الكشف وأرشفته" : "Complete & Archive"}
          </Button>
        </>}>
        {activeApt && (
          <form id="consult-form" onSubmit={handleComplete} className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-blue-500/8 border border-blue-500/20 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-white font-bold text-lg">
                {activeApt.patient.name[0]}
              </div>
              <div>
                <p className="font-semibold text-white">{activeApt.patient.name}</p>
                <p className="text-xs text-slate-500">{activeApt.reason ?? (ar ? "بدون سبب محدد" : "No reason specified")}</p>
              </div>
              <div className="ms-auto text-end">
                <p className="text-xs text-slate-500">{formatTime(activeApt.date, locale)}</p>
                <p className="text-xs text-slate-600">{typeLabel(activeApt.type, ar)}</p>
              </div>
            </div>
            <Textarea name="diagnosis" label={ar ? "التشخيص" : "Diagnosis"} rows={3} defaultValue={activeApt.diagnosis ?? ""} placeholder={ar ? "اكتب التشخيص..." : "Enter diagnosis..."} />
            <Textarea name="prescription" label={ar ? "الوصفة الطبية" : "Prescription"} rows={3} defaultValue={activeApt.prescription ?? ""} placeholder={ar ? "الأدوية والجرعات..." : "Medications and dosages..."} />
            <Textarea name="notes" label={ar ? "ملاحظات" : "Notes"} rows={2} defaultValue={activeApt.notes ?? ""} />
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
              {ar ? "سيُحذف الموعد من الاستقبال وقائمة الطبيب وينتقل للأرشيف" : "Appointment will be archived and removed from active views"}
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}
