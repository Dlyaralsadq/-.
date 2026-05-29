"use client";

import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus, CalendarPlus, CheckCircle2, Clock, User,
  Stethoscope, Phone, Hash, ChevronRight, Search,
  PlayCircle, XCircle, RefreshCw, Monitor, DoorOpen
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { checkInPatient, quickBookAppointment, confirmPatientEntry } from "@/app/actions/clinic";
import { formatTime } from "@/lib/utils";
import Link from "next/link";

interface Patient { id: string; name: string; nameAr: string | null; phone: string; }
interface Appointment {
  id: string; appointmentNumber: string; date: Date; type: string;
  status: string; arrivalStatus: string; queueNumber: number | null; reason: string | null;
  patient: { id: string; name: string; nameAr: string | null; phone: string; };
}

const arrivalColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-600",
  arrived: "bg-amber-100 text-amber-700",
  called: "bg-yellow-100 text-yellow-700",
  with_doctor: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
};

export default function SecretaryClient({ queue, doctor, patients, doctorId, locale }: {
  queue: Appointment[]; doctor: any; patients: Patient[]; doctorId: string; locale: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"today" | "book">("today");

  const ar = locale === "ar";

  const called = queue.find(a => a.arrivalStatus === "called");
  const pending = queue.filter(a => a.arrivalStatus === "pending");
  const waiting = queue.filter(a => a.arrivalStatus === "arrived");
  const withDoctor = queue.find(a => a.arrivalStatus === "with_doctor");
  const done = queue.filter(a => a.arrivalStatus === "done");

  const handleCheckIn = async (appointmentId: string) => {
    setLoading(true);
    await checkInPatient(appointmentId, doctorId);
    setLoading(false);
    router.refresh();
  };

  const handleConfirmEntry = async (appointmentId: string) => {
    setLoading(true);
    await confirmPatientEntry(appointmentId, doctorId);
    setLoading(false);
    router.refresh();
  };

  const handleQuickBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const existingId = fd.get("existingPatientId") as string;
    await quickBookAppointment(doctorId, {
      patientName: fd.get("patientName") as string,
      patientPhone: fd.get("patientPhone") as string,
      patientGender: fd.get("patientGender") as string,
      patientNameAr: fd.get("patientNameAr") as string || undefined,
      date: fd.get("date") as string,
      time: fd.get("time") as string,
      type: fd.get("type") as string,
      reason: fd.get("reason") as string || undefined,
      existingPatientId: existingId || undefined,
    });
    setLoading(false);
    setBookingOpen(false);
    router.refresh();
  };

  const filteredQueue = search
    ? queue.filter(a =>
        a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
        a.patient.phone.includes(search) ||
        String(a.queueNumber).includes(search)
      )
    : queue;

  const patientOptions = patients.map(p => ({ value: p.id, label: `${p.name} — ${p.phone}` }));
  const typeOptions = [
    { value: "consultation", label: ar ? "استشارة" : "Consultation" },
    { value: "followUp", label: ar ? "متابعة" : "Follow-up" },
    { value: "emergency", label: ar ? "طارئ" : "Emergency" },
    { value: "procedure", label: ar ? "إجراء طبي" : "Procedure" },
  ];
  const genderOptions = [
    { value: "male", label: ar ? "ذكر" : "Male" },
    { value: "female", label: ar ? "أنثى" : "Female" },
  ];

  const today = new Date().toLocaleDateString(ar ? "ar-SA" : "en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {ar ? "استقبال العيادة" : "Clinic Reception"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          {doctor && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
                <Stethoscope className="h-3.5 w-3.5 text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-indigo-700">
                {ar ? doctor.nameAr : doctor.name} — {ar ? doctor.specialty.nameAr : doctor.specialty.name}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/${locale}/waiting?d=${doctorId}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Monitor className="h-4 w-4" />
            {ar ? "شاشة الانتظار" : "Waiting Screen"}
          </Link>
          <Button onClick={() => setBookingOpen(true)}>
            <CalendarPlus className="h-4 w-4" />
            {ar ? "حجز موعد جديد" : "New Booking"}
          </Button>
        </div>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: ar ? "لم يصلوا بعد" : "Pending", count: pending.length, color: "gray", icon: Clock },
          { label: ar ? "في الانتظار" : "Waiting", count: waiting.length, color: "amber", icon: User },
          { label: ar ? "تم النداء" : "Called", count: called ? 1 : 0, color: "yellow", icon: Stethoscope },
          { label: ar ? "مع الطبيب" : "With Doctor", count: withDoctor ? 1 : 0, color: "blue", icon: Stethoscope },
          { label: ar ? "انتهوا" : "Done", count: done.length, color: "green", icon: CheckCircle2 },
        ].map(({ label, count, color, icon: Icon }) => (
          <div key={label} className={`card p-4 border-t-4 border-${color}-400`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{count}</p>
              </div>
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-${color}-50`}>
                <Icon className={`h-5 w-5 text-${color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Called patient — needs confirmation */}
      {called && (
        <div className="rounded-2xl border-2 border-yellow-400 bg-yellow-50 p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-white">
                <span className="text-lg font-black">{called.queueNumber}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse" />
                  <p className="text-sm font-bold text-yellow-800">
                    {ar ? "تم نداء المريض — يُعرض على شاشة الانتظار" : "Patient Called — Showing on Waiting Screen"}
                  </p>
                </div>
                <p className="text-base font-semibold text-gray-800 mt-0.5">{called.patient.name}</p>
                <p className="text-xs text-gray-500">{called.patient.phone}</p>
              </div>
            </div>
            <Button
              className="gap-2 bg-green-600 hover:bg-green-700 text-white shrink-0"
              onClick={() => handleConfirmEntry(called.id)}
              disabled={loading}
            >
              <DoorOpen className="h-4 w-4" />
              {ar ? "تأكيد الدخول" : "Confirm Entry"}
            </Button>
          </div>
        </div>
      )}

      {/* Currently with doctor highlight */}
      {withDoctor && (
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
          <p className="text-sm text-blue-200 flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4" />
            {ar ? "المريض الحالي مع الطبيب" : "Currently with Doctor"}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold">
                {withDoctor.patient.name[0]}
              </div>
              <div>
                <p className="text-lg font-bold">{withDoctor.patient.name}</p>
                <p className="text-sm text-blue-200 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" />
                  {withDoctor.patient.phone}
                </p>
              </div>
            </div>
            {withDoctor.queueNumber && (
              <div className="text-end">
                <p className="text-xs text-blue-200">{ar ? "رقم الدور" : "Queue #"}</p>
                <p className="text-3xl font-black">{withDoctor.queueNumber}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-sm">
          <Search className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={ar ? "البحث باسم المريض أو رقم الهاتف..." : "Search by name or phone..."}
            className="w-full rounded-lg border border-gray-300 ps-9 pe-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Queue table */}
      <div className="card overflow-hidden">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            {ar ? `قائمة مواعيد اليوم (${queue.length})` : `Today's Appointments (${queue.length})`}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{ar ? "الدور" : "#"}</th>
                <th>{ar ? "المريض" : "Patient"}</th>
                <th>{ar ? "الوقت" : "Time"}</th>
                <th>{ar ? "نوع الزيارة" : "Type"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th className="text-center">{ar ? "الإجراء" : "Action"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    {ar ? "لا توجد مواعيد اليوم" : "No appointments today"}
                  </td>
                </tr>
              ) : filteredQueue.map(apt => (
                <tr key={apt.id} className={apt.arrivalStatus === "with_doctor" ? "bg-blue-50" : ""}>
                  <td>
                    {apt.queueNumber ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm">
                        {apt.queueNumber}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-sm">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-600 text-sm">
                        {apt.patient.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.patient.name}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {apt.patient.phone}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="text-sm text-gray-700 font-medium">{formatTime(apt.date, locale)}</td>
                  <td>
                    <span className="text-xs text-gray-500">
                      {typeOptions.find(t => t.value === apt.type)?.label ?? apt.type}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${arrivalColors[apt.arrivalStatus]}`}>
                      {apt.arrivalStatus === "pending" ? (ar ? "لم يصل" : "Pending")
                        : apt.arrivalStatus === "arrived" ? (ar ? "وصل - ينتظر" : "Waiting")
                        : apt.arrivalStatus === "called" ? (ar ? "تم النداء" : "Called")
                        : apt.arrivalStatus === "with_doctor" ? (ar ? "مع الطبيب" : "With Doctor")
                        : (ar ? "انتهى" : "Done")}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center">
                      {apt.arrivalStatus === "pending" && (
                        <Button variant="outline" size="sm" className="gap-1.5 text-green-700 border-green-300 hover:bg-green-50"
                          onClick={() => handleCheckIn(apt.id)} disabled={loading}>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {ar ? "تسجيل وصول" : "Check In"}
                        </Button>
                      )}
                      {apt.arrivalStatus === "arrived" && (
                        <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {ar ? `دوره ${apt.queueNumber}` : `Queue ${apt.queueNumber}`}
                        </span>
                      )}
                      {apt.arrivalStatus === "called" && (
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-green-700 bg-green-50 hover:bg-green-100 gap-1"
                          onClick={() => handleConfirmEntry(apt.id)} disabled={loading}>
                          <DoorOpen className="h-3.5 w-3.5" />
                          {ar ? "تأكيد الدخول" : "Confirm Entry"}
                        </Button>
                      )}
                      {apt.arrivalStatus === "with_doctor" && (
                        <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                          <Stethoscope className="h-3.5 w-3.5" />
                          {ar ? "عند الطبيب" : "In Session"}
                        </span>
                      )}
                      {apt.arrivalStatus === "done" && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {ar ? "انتهى" : "Done"}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Booking Modal */}
      <Modal isOpen={bookingOpen} onClose={() => setBookingOpen(false)}
        title={ar ? "حجز موعد جديد" : "New Appointment Booking"} size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setBookingOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="booking-form" loading={loading}>{ar ? "تأكيد الحجز" : "Confirm Booking"}</Button>
        </>}>
        <form id="booking-form" onSubmit={handleQuickBook} className="space-y-5">
          {/* Patient section */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 space-y-3">
            <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              {ar ? "بيانات المريض" : "Patient Information"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input name="patientName" label={ar ? "الاسم (إنجليزي)" : "Full Name"} required placeholder="Mohammed Al-Ahmadi" />
              <Input name="patientNameAr" label={ar ? "الاسم (عربي)" : "الاسم بالعربية"} placeholder="محمد الأحمدي" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input name="patientPhone" type="tel" label={ar ? "رقم الجوال" : "Phone"} required placeholder="+966 5x xxx xxxx" />
              <Select name="patientGender" label={ar ? "الجنس" : "Gender"} options={genderOptions} placeholder={ar ? "اختر" : "Select"} required />
            </div>
            <p className="text-xs text-blue-500">
              {ar ? "سيتم إنشاء ملف مريض جديد تلقائياً إذا لم يكن موجوداً" : "A new patient record will be created automatically if not found"}
            </p>
          </div>

          {/* Appointment section */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 space-y-3">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <CalendarPlus className="h-4 w-4" />
              {ar ? "تفاصيل الموعد" : "Appointment Details"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input name="date" type="date" label={ar ? "التاريخ" : "Date"} required
                defaultValue={new Date().toISOString().split("T")[0]} />
              <Input name="time" type="time" label={ar ? "الوقت" : "Time"} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select name="type" label={ar ? "نوع الزيارة" : "Type"} options={typeOptions} defaultValue="consultation" />
              <Input name="reason" label={ar ? "سبب الزيارة" : "Reason"} />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
