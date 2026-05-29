"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Stethoscope, Users, ChevronRight, ClipboardList,
  CheckCircle2, Clock, ArrowRight, FileText,
  Phone, Activity, PlayCircle, Monitor, Calendar,
  Pill, NotebookPen, AlertCircle
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { callNextPatient, updateDiagnosis } from "@/app/actions/clinic";
import { formatTime } from "@/lib/utils";

interface Appointment {
  id: string; appointmentNumber: string; date: Date;
  type: string; status: string; arrivalStatus: string;
  queueNumber: number | null; reason: string | null;
  diagnosis: string | null; prescription: string | null; notes: string | null;
  patient: { id: string; name: string; nameAr: string | null; phone: string; bloodType: string | null; };
}

export default function DoctorClinicClient({ doctor, queue, roomData, locale }: {
  doctor: any; queue: Appointment[]; roomData: any; locale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [consultOpen, setConsultOpen] = useState(false);
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [saving, setSaving] = useState(false);

  const ar = locale === "ar";
  const current = queue.find(a => a.arrivalStatus === "with_doctor");
  const waiting = queue.filter(a => a.arrivalStatus === "arrived");
  const done = queue.filter(a => a.arrivalStatus === "done");
  const pending = queue.filter(a => a.arrivalStatus === "pending");

  const handleCallNext = async () => {
    startTransition(async () => {
      await callNextPatient(doctor.id);
      router.refresh();
    });
  };

  const handleSaveConsult = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!activeAppointment) return;
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    await updateDiagnosis(activeAppointment.id, doctor.id, {
      diagnosis: fd.get("diagnosis") as string,
      prescription: fd.get("prescription") as string,
      notes: fd.get("notes") as string,
    });
    setSaving(false);
    setConsultOpen(false);
    router.refresh();
  };

  const typeLabel: Record<string, string> = {
    consultation: ar ? "استشارة" : "Consultation",
    followUp: ar ? "متابعة" : "Follow-up",
    emergency: ar ? "طارئ" : "Emergency",
    procedure: ar ? "إجراء" : "Procedure",
  };

  return (
    <div className="space-y-5 animate-fade-in">

      {/* Doctor header */}
      <div className="rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-6 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black">
                {doctor.name[0]}
              </div>
              <div>
                <p className="text-xs text-indigo-200 uppercase tracking-wide">{ar ? "الطبيب المعالج" : "Attending Physician"}</p>
                <h1 className="text-xl font-bold">{ar ? doctor.nameAr : doctor.name}</h1>
                <p className="text-sm text-indigo-200 flex items-center gap-1.5 mt-0.5">
                  <Stethoscope className="h-3.5 w-3.5" />
                  {ar ? doctor.specialty.nameAr : doctor.specialty.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/${locale}/waiting?d=${doctor.id}`} target="_blank"
                className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/25 transition-colors">
                <Monitor className="h-4 w-4" />
                {ar ? "شاشة الانتظار" : "Waiting Screen"}
              </Link>
              <Link href={`/${locale}/secretary`}
                className="flex items-center gap-2 rounded-xl bg-white/15 border border-white/30 px-4 py-2 text-sm text-white hover:bg-white/25 transition-colors">
                <Users className="h-4 w-4" />
                {ar ? "الاستقبال" : "Reception"}
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-5 grid grid-cols-4 gap-3">
            {[
              { label: ar ? "الانتظار" : "Waiting", value: waiting.length, color: "yellow" },
              { label: ar ? "مع الطبيب" : "In Session", value: current ? 1 : 0, color: "blue" },
              { label: ar ? "انتهوا" : "Done", value: done.length, color: "green" },
              { label: ar ? "الإجمالي" : "Total", value: queue.length, color: "white" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-xl bg-white/10 p-3 text-center">
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-xs text-indigo-200 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

        {/* LEFT: Current patient + call next */}
        <div className="space-y-4 lg:col-span-2">

          {/* Current patient */}
          {current ? (
            <div className="card overflow-hidden">
              <div className="bg-blue-600 px-5 py-3 flex items-center gap-2 text-white">
                <Activity className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-semibold">{ar ? "المريض الحالي" : "Current Patient"}</span>
                {current.queueNumber && (
                  <span className="ms-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold">
                    #{current.queueNumber}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                    {current.patient.name[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">{current.patient.name}</h2>
                    {current.patient.nameAr && <p className="text-sm text-gray-500">{current.patient.nameAr}</p>}
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{current.patient.phone}</span>
                      {current.patient.bloodType && (
                        <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                          {current.patient.bloodType}
                        </span>
                      )}
                    </div>
                    {current.reason && (
                      <div className="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-sm text-amber-700 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{current.reason}</span>
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                      {typeLabel[current.type] ?? current.type}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button className="flex-1 gap-2" size="lg"
                    onClick={() => { setActiveAppointment(current); setConsultOpen(true); }}>
                    <NotebookPen className="h-4 w-4" />
                    {ar ? "تسجيل التشخيص والوصفة" : "Add Diagnosis & Prescription"}
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={handleCallNext} disabled={isPending}>
                    <PlayCircle className="h-4 w-4" />
                    {ar ? "التالي" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-center py-4">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Stethoscope className="h-8 w-8 text-gray-300" />
                </div>
                <p className="font-medium text-gray-500 mb-4">
                  {waiting.length > 0
                    ? (ar ? "لا يوجد مريض حالي. اضغط استدعاء التالي" : "No current patient. Press call next.")
                    : (ar ? "لا يوجد مرضى ينتظرون حالياً" : "No patients waiting currently")}
                </p>
                {waiting.length > 0 && (
                  <Button size="lg" className="gap-2" onClick={handleCallNext} disabled={isPending} loading={isPending}>
                    <PlayCircle className="h-5 w-5" />
                    {ar ? `استدعاء المريض التالي (${waiting.length} في الانتظار)` : `Call Next Patient (${waiting.length} waiting)`}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Waiting queue */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-5 py-3.5">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                {ar ? "قائمة الانتظار" : "Waiting Queue"}
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">{waiting.length}</span>
              </h2>
              {waiting.length > 0 && !current && (
                <Button size="sm" className="gap-1.5" onClick={handleCallNext} disabled={isPending}>
                  <PlayCircle className="h-3.5 w-3.5" />
                  {ar ? "استدعاء" : "Call"}
                </Button>
              )}
            </div>
            <div className="divide-y">
              {waiting.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-gray-400">
                  {ar ? "لا أحد في الانتظار حالياً" : "No one waiting"}
                </p>
              ) : waiting.map((apt, i) => (
                <div key={apt.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm">
                    {apt.queueNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{apt.patient.name}</p>
                    <p className="text-xs text-gray-400">{apt.patient.phone}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-xs text-gray-500">{formatTime(apt.date, locale)}</p>
                    <p className="text-xs text-gray-400">{typeLabel[apt.type]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Done + navigation */}
        <div className="space-y-4">
          {/* Done today */}
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b px-5 py-3.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <h2 className="font-semibold text-gray-900">{ar ? "انتهوا اليوم" : "Done Today"}</h2>
              <span className="ms-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">{done.length}</span>
            </div>
            <div className="divide-y max-h-56 overflow-y-auto">
              {done.length === 0 ? (
                <p className="px-5 py-6 text-center text-xs text-gray-400">{ar ? "لا أحد" : "None yet"}</p>
              ) : done.map(apt => (
                <div key={apt.id} className="flex items-center gap-3 px-5 py-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{apt.patient.name}</p>
                    <p className="text-xs text-gray-400">{formatTime(apt.date, locale)}</p>
                  </div>
                  {apt.diagnosis && (
                    <span title={apt.diagnosis}>
                      <FileText className="h-3.5 w-3.5 text-blue-400" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="card p-4 space-y-2">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">{ar ? "روابط سريعة" : "Quick Links"}</h2>
            {[
              { href: `/${locale}/doctor/patients`, icon: Users, label: ar ? "مرضاي" : "My Patients" },
              { href: `/${locale}/doctor/appointments`, icon: Calendar, label: ar ? "جميع مواعيدي" : "All Appointments" },
              { href: `/${locale}/secretary`, icon: ClipboardList, label: ar ? "الاستقبال" : "Reception" },
              { href: `/${locale}/waiting?d=${doctor.id}`, icon: Monitor, label: ar ? "شاشة الانتظار" : "Waiting Screen", target: "_blank" },
            ].map(({ href, icon: Icon, label, target }) => (
              <Link key={href} href={href} target={target}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-40 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Consultation Modal */}
      <Modal isOpen={consultOpen} onClose={() => setConsultOpen(false)}
        title={ar ? "تسجيل الكشف الطبي" : "Medical Consultation"}
        size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setConsultOpen(false)} disabled={saving}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="consult-form" loading={saving}>{ar ? "حفظ وإنهاء الكشف" : "Save & Complete"}</Button>
        </>}>
        {activeAppointment && (
          <form id="consult-form" onSubmit={handleSaveConsult} className="space-y-4">
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                {activeAppointment.patient.name[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{activeAppointment.patient.name}</p>
                <p className="text-xs text-gray-500">{activeAppointment.reason ?? (ar ? "لا يوجد سبب محدد" : "No reason specified")}</p>
              </div>
            </div>
            <Textarea name="diagnosis" label={ar ? "التشخيص" : "Diagnosis"}
              defaultValue={activeAppointment.diagnosis ?? ""} rows={3}
              placeholder={ar ? "اكتب التشخيص هنا..." : "Enter diagnosis..."} />
            <Textarea name="prescription" label={ar ? "الوصفة الطبية" : "Prescription"}
              defaultValue={activeAppointment.prescription ?? ""} rows={3}
              placeholder={ar ? "الأدوية والجرعات..." : "Medications and dosages..."} />
            <Textarea name="notes" label={ar ? "ملاحظات إضافية" : "Additional Notes"}
              defaultValue={activeAppointment.notes ?? ""} rows={2} />
          </form>
        )}
      </Modal>
    </div>
  );
}

