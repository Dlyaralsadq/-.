"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarPlus, CheckCircle2, Clock, User, Stethoscope,
  Phone, Search, DoorOpen, Banknote, MonitorPlay, ChevronRight,
  UserCheck, AlertCircle, X, CheckCheck
} from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { checkInPatient, quickBookAppointment, confirmPatientEntry, markPayment } from "@/app/actions/clinic";
import { formatTime } from "@/lib/utils";

interface Patient { id: string; name: string; nameAr: string | null; phone: string; }
interface Appointment {
  id: string; appointmentNumber: string; date: Date; type: string;
  status: string; arrivalStatus: string; queueNumber: number | null;
  reason: string | null; isPaid: boolean;
  patient: { id: string; name: string; nameAr: string | null; phone: string; };
}

const STATUS_CONFIG: Record<string, { label_ar: string; label_en: string; dot: string; bg: string; text: string }> = {
  pending:     { label_ar: "لم يصل", label_en: "Pending", dot: "bg-slate-500", bg: "bg-slate-500/10", text: "text-slate-400" },
  arrived:     { label_ar: "وصل", label_en: "Arrived", dot: "bg-amber-400", bg: "bg-amber-500/10", text: "text-amber-400" },
  called:      { label_ar: "تم النداء", label_en: "Called", dot: "bg-yellow-400 animate-pulse", bg: "bg-yellow-500/15", text: "text-yellow-300" },
  with_doctor: { label_ar: "مع الطبيب", label_en: "With Doctor", dot: "bg-blue-400", bg: "bg-blue-500/10", text: "text-blue-400" },
  done:        { label_ar: "انتهى", label_en: "Done", dot: "bg-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

export default function SecretaryClient({ queue, doctor, patients, doctorId, locale }: {
  queue: Appointment[]; doctor: any; patients: Patient[]; doctorId: string; locale: string;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [today, setToday] = useState("");

  const ar = locale === "ar";

  useEffect(() => {
    setToday(new Date().toLocaleDateString(ar ? "ar-SA" : "en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }));
  }, [ar]);

  const pending  = queue.filter(a => a.arrivalStatus === "pending");
  const arrived  = queue.filter(a => a.arrivalStatus === "arrived");
  const called   = queue.find(a => a.arrivalStatus === "called");
  const withDoc  = queue.find(a => a.arrivalStatus === "with_doctor");
  const active   = queue.filter(a => !["done"].includes(a.arrivalStatus));

  const filtered = search
    ? queue.filter(a =>
        a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        a.patient.phone.includes(search) ||
        String(a.queueNumber ?? "").includes(search))
    : queue;

  const act = async (fn: () => Promise<unknown>) => {
    setLoading(true);
    await fn();
    setLoading(false);
    router.refresh();
  };

  const typeLabels: Record<string, string> = {
    consultation: ar ? "استشارة" : "Consultation",
    followUp: ar ? "متابعة" : "Follow-up",
    emergency: ar ? "طارئ" : "Emergency",
    procedure: ar ? "إجراء" : "Procedure",
  };

  const genderOpts = [{ value: "male", label: ar ? "ذكر" : "Male" }, { value: "female", label: ar ? "أنثى" : "Female" }];
  const typeOpts   = Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }));

  const handleBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await quickBookAppointment(doctorId, {
      patientName: fd.get("patientName") as string,
      patientPhone: fd.get("patientPhone") as string,
      patientGender: fd.get("patientGender") as string,
      patientNameAr: fd.get("patientNameAr") as string || undefined,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      type: fd.get("type") as string,
      reason: fd.get("reason") as string || undefined,
    });
    setLoading(false);
    setBookingOpen(false);
    router.refresh();
  };

  return (
    <div className="min-h-full mesh-bg">
      <div className="space-y-5 p-0">

        {/* ── Header ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{ar ? "استقبال العيادة" : "Clinic Reception"}</h1>
            <p className="text-sm text-slate-500 mt-0.5">{today}</p>
            {doctor && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Stethoscope className="h-3.5 w-3.5 text-indigo-400" />
                <span className="text-indigo-300 font-medium">{ar ? doctor.nameAr : doctor.name}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-500">{ar ? doctor.specialty.nameAr : doctor.specialty.name}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href={`/${locale}/waiting?d=${doctorId}`} target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-[#2a3347] bg-[#111827] px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all">
              <MonitorPlay className="h-3.5 w-3.5" />{ar ? "شاشة الانتظار" : "Waiting Screen"}
            </Link>
            <Button onClick={() => setBookingOpen(true)}>
              <CalendarPlus className="h-4 w-4" />
              {ar ? "حجز موعد" : "New Booking"}
            </Button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: ar ? "لم يصلوا" : "Pending", n: pending.length, color: "slate", icon: Clock },
            { label: ar ? "في الانتظار" : "Waiting", n: arrived.length, color: "amber", icon: User },
            { label: ar ? "مع الطبيب" : "With Doctor", n: (called ? 1 : 0) + (withDoc ? 1 : 0), color: "blue", icon: Stethoscope },
            { label: ar ? "إجمالي اليوم" : "Total Today", n: queue.length, color: "indigo", icon: CheckCircle2 },
          ].map(({ label, n, color, icon: Icon }) => (
            <div key={label} className="card p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-${color}-500/10`}>
                <Icon className={`h-4.5 w-4.5 text-${color}-400`} />
              </div>
              <p className="text-2xl font-black text-white">{n}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Called / Active alert ── */}
        {called && (
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/8 p-4 glow-yellow animate-fade-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-300 text-lg font-black animate-pulse-ring">
                  {called.queueNumber}
                </div>
                <div>
                  <p className="text-xs text-yellow-400/80 font-medium">{ar ? "⚡ تم النداء — شاشة العيادة تعرض الإشعار" : "⚡ Called — Waiting room screen alerting"}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{called.patient.name}</p>
                </div>
              </div>
              <Button variant="success" size="sm" className="gap-1.5 shrink-0"
                onClick={() => act(() => confirmPatientEntry(called.id, doctorId))} disabled={loading}>
                <DoorOpen className="h-3.5 w-3.5" />
                {ar ? "تأكيد الدخول" : "Confirm Entry"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Search ── */}
        <div className="card p-3">
          <div className="relative max-w-sm">
            <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={ar ? "البحث في المواعيد..." : "Search appointments..."}
              className="form-input ps-9 pe-3 py-2 text-sm w-full" />
          </div>
        </div>

        {/* ── Appointments Table ── */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2536]">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              {ar ? `مواعيد اليوم — ${queue.length} موعد` : `Today's Appointments — ${queue.length}`}
            </h2>
            <Link href={`/${locale}/doctor/appointments`} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              {ar ? "السجل الكامل" : "Full archive"}<ChevronRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <CalendarPlus className="h-10 w-10 mx-auto mb-3 text-slate-700" />
              <p className="text-slate-500 text-sm">{ar ? "لا توجد مواعيد اليوم" : "No appointments today"}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setBookingOpen(true)}>
                {ar ? "إضافة موعد" : "Add appointment"}
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{ar ? "المريض" : "Patient"}</th>
                    <th>{ar ? "الوقت" : "Time"}</th>
                    <th>{ar ? "نوع الزيارة" : "Type"}</th>
                    <th>{ar ? "الحالة" : "Status"}</th>
                    <th>{ar ? "الدفع" : "Payment"}</th>
                    <th className="text-center">{ar ? "الإجراءات" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(apt => {
                    const cfg = STATUS_CONFIG[apt.arrivalStatus] ?? STATUS_CONFIG.pending;
                    return (
                      <tr key={apt.id}>
                        <td>
                          {apt.queueNumber ? (
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-300 font-bold text-sm border border-indigo-500/20">
                              {apt.queueNumber}
                            </span>
                          ) : <span className="text-slate-600 text-sm">—</span>}
                        </td>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-slate-300 font-semibold text-xs">
                              {apt.patient.name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{apt.patient.name}</p>
                              <p className="text-xs text-slate-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />{apt.patient.phone}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="font-medium text-slate-300">{formatTime(apt.date, locale)}</td>
                        <td className="text-slate-400 text-xs">{typeLabels[apt.type] ?? apt.type}</td>
                        <td>
                          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                            {ar ? cfg.label_ar : cfg.label_en}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => act(() => markPayment(apt.id, doctorId, !apt.isPaid))}
                            disabled={loading}
                            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                              apt.isPaid
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                                : "bg-slate-700/40 text-slate-500 border border-slate-600/30 hover:border-amber-500/30 hover:text-amber-400"
                            }`}>
                            <Banknote className="h-3 w-3" />
                            {apt.isPaid ? (ar ? "مدفوع" : "Paid") : (ar ? "لم يدفع" : "Unpaid")}
                          </button>
                        </td>
                        <td>
                          <div className="flex items-center justify-center gap-1">
                            {apt.arrivalStatus === "pending" && (
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                onClick={() => act(() => checkInPatient(apt.id, doctorId))} disabled={loading}>
                                <UserCheck className="h-3.5 w-3.5" />{ar ? "وصل" : "Arrived"}
                              </Button>
                            )}
                            {apt.arrivalStatus === "called" && (
                              <Button variant="success" size="sm" className="h-7 px-2 text-xs gap-1"
                                onClick={() => act(() => confirmPatientEntry(apt.id, doctorId))} disabled={loading}>
                                <DoorOpen className="h-3.5 w-3.5" />{ar ? "دخل" : "Entered"}
                              </Button>
                            )}
                            {apt.arrivalStatus === "arrived" && (
                              <span className="text-xs text-amber-400 flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />{ar ? `دور ${apt.queueNumber}` : `#${apt.queueNumber}`}
                              </span>
                            )}
                            {apt.arrivalStatus === "with_doctor" && (
                              <span className="text-xs text-blue-400 flex items-center gap-1">
                                <Stethoscope className="h-3.5 w-3.5" />{ar ? "عند الطبيب" : "In Session"}
                              </span>
                            )}
                            {apt.arrivalStatus === "done" && (
                              <span className="text-xs text-emerald-400 flex items-center gap-1">
                                <CheckCheck className="h-3.5 w-3.5" />{ar ? "انتهى" : "Done"}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Booking Modal ── */}
        <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)}
          title={ar ? "حجز موعد جديد" : "New Appointment"} size="lg"
          footer={<>
            <Button variant="secondary" onClick={() => setBookingOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
            <Button type="submit" form="book-form" loading={loading}>{ar ? "تأكيد الحجز" : "Book"}</Button>
          </>}>
          <form id="book-form" onSubmit={handleBook} className="space-y-4">
            <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-4 space-y-3">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{ar ? "بيانات المريض" : "Patient Info"}</p>
              <div className="grid grid-cols-2 gap-3">
                <Input name="patientName" label={ar ? "الاسم (إنجليزي)" : "Full Name"} required placeholder="Mohammed Al-Ahmadi" />
                <Input name="patientNameAr" label={ar ? "الاسم (عربي)" : "Name in Arabic"} placeholder="محمد الأحمدي" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input name="patientPhone" type="tel" label={ar ? "الجوال" : "Phone"} required placeholder="+966 5x xxx xxxx" />
                <Select name="patientGender" label={ar ? "الجنس" : "Gender"} options={genderOpts} placeholder={ar ? "اختر" : "Select"} required />
              </div>
              <p className="text-xs text-slate-500">{ar ? "⚡ إذا لم يكن المريض موجوداً سيُنشأ ملفه تلقائياً" : "⚡ Patient record will be auto-created if not found"}</p>
            </div>
            <div className="rounded-xl bg-slate-800/40 border border-[#2a3347] p-4 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{ar ? "تفاصيل الموعد" : "Appointment Details"}</p>
              <div className="grid grid-cols-2 gap-3">
                <Input name="date" type="date" label={ar ? "التاريخ" : "Date"} required />
                <Input name="time" type="time" label={ar ? "الوقت" : "Time"} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select name="type" label={ar ? "نوع الزيارة" : "Type"} options={typeOpts} defaultValue="consultation" />
                <Input name="reason" label={ar ? "سبب الزيارة" : "Reason"} />
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
