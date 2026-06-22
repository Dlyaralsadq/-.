"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, Phone, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { createOnlineBooking } from "@/app/actions/publicBooking";

const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
  "17:00","17:30","18:00","18:30","19:00","19:30",
];

export default function BookingForm({
  doctorId,
  doctorName,
  doctorNameAr,
  specialtyAr,
  specialtyEn,
  locale,
}: {
  doctorId: string;
  doctorName: string;
  doctorNameAr: string;
  specialtyAr: string;
  specialtyEn: string;
  locale: string;
}) {
  const ar = locale === "ar";
  const router = useRouter();

  const [step, setStep] = useState<"form" | "success" | "error">("form");
  const [loading, setLoading] = useState(false);
  const [aptNumber, setAptNumber] = useState("");
  const [errMsg, setErrMsg] = useState("");

  // Minimum date = tomorrow
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().slice(0, 10);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrMsg("");

    const fd = new FormData(e.currentTarget);
    const result = await createOnlineBooking({
      doctorId,
      patientName:   fd.get("name") as string,
      patientNameAr: fd.get("nameAr") as string,
      phone:         fd.get("phone") as string,
      date:          fd.get("date") as string,
      time:          fd.get("time") as string,
      reason:        fd.get("reason") as string,
      locale,
    });

    if (result.success) {
      setAptNumber(result.appointmentNumber ?? "");
      setStep("success");
    } else {
      const msgs: Record<string, { ar: string; en: string }> = {
        slot_taken:        { ar: "هذا الوقت محجوز، الرجاء اختيار وقت آخر", en: "This time slot is taken, please choose another" },
        doctor_unavailable:{ ar: "الطبيب غير متاح حالياً", en: "Doctor is not available" },
        invalid_date:      { ar: "التاريخ أو الوقت غير صحيح", en: "Invalid date or time" },
      };
      setErrMsg((msgs[result.error ?? ""] ?? msgs.invalid_date)[ar ? "ar" : "en"]);
      setLoading(false);
    }
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30 mb-6">
          <CheckCircle2 size={40} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          {ar ? "تم الحجز بنجاح!" : "Booking Confirmed!"}
        </h2>
        <p className="text-white/40 text-sm mb-2">
          {ar ? "رقم موعدك:" : "Your appointment number:"}
        </p>
        <p className="text-xl font-mono font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-6 py-2 rounded-xl mb-6">
          {aptNumber}
        </p>
        <p className="text-white/40 text-sm max-w-xs mb-8">
          {ar
            ? "سيتواصل معك السكرتير لتأكيد الموعد أو يمكنك الحضور في الوقت المحدد"
            : "The secretary will contact you to confirm, or simply arrive at the scheduled time"}
        </p>
        <button
          onClick={() => router.push(`/${locale}/patient`)}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition"
        >
          {ar ? "العودة للرئيسية" : "Back to home"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {errMsg && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
          <AlertCircle size={15} className="shrink-0" />
          {errMsg}
        </div>
      )}

      {/* Doctor info strip */}
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/8 px-4 py-3">
        <p className="text-xs text-indigo-400/60">{ar ? "الطبيب" : "Doctor"}</p>
        <p className="text-sm font-bold text-white mt-0.5">{ar ? doctorNameAr : doctorName}</p>
        <p className="text-xs text-indigo-400">{ar ? specialtyAr : specialtyEn}</p>
      </div>

      {/* Patient name */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            {ar ? "الاسم بالعربي *" : "Name (Arabic) *"}
          </label>
          <div className="relative">
            <input
              name="nameAr"
              required
              dir="rtl"
              placeholder="محمد أحمد"
              className="w-full rounded-xl border border-white/10 bg-[#0c1121] ps-4 pe-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
            />
            <User size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            {ar ? "الاسم بالإنجليزي" : "Name (English)"}
          </label>
          <div className="relative">
            <input
              name="name"
              dir="ltr"
              placeholder="Mohammed Ahmed"
              className="w-full rounded-xl border border-white/10 bg-[#0c1121] ps-4 pe-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
            />
            <User size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
          </div>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5">
          {ar ? "رقم الهاتف *" : "Phone number *"}
        </label>
        <div className="relative">
          <input
            name="phone"
            required
            type="tel"
            dir="ltr"
            placeholder="07XXXXXXXXX"
            pattern="^0?[5-9][0-9]{8,9}$"
            className="w-full rounded-xl border border-white/10 bg-[#0c1121] ps-4 pe-10 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50"
          />
          <Phone size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            {ar ? "التاريخ *" : "Date *"}
          </label>
          <div className="relative">
            <input
              name="date"
              required
              type="date"
              min={minDateStr}
              className="w-full rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50 [color-scheme:dark]"
            />
            <Calendar size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-white/40 mb-1.5">
            {ar ? "الوقت *" : "Time *"}
          </label>
          <div className="relative">
            <select
              name="time"
              required
              className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c1121] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">{ar ? "اختر" : "Choose"}</option>
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <Clock size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-white/25" />
          </div>
        </div>
      </div>

      {/* Reason */}
      <div>
        <label className="block text-xs text-white/40 mb-1.5">
          {ar ? "سبب الزيارة *" : "Reason for visit *"}
        </label>
        <div className="relative">
          <textarea
            name="reason"
            required
            rows={3}
            placeholder={ar ? "اذكر سبب الزيارة..." : "Describe your reason..."}
            className="w-full rounded-xl border border-white/10 bg-[#0c1121] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 resize-none"
          />
          <FileText size={14} className="pointer-events-none absolute end-3 top-3.5 text-white/25" />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/60 hover:opacity-90 disabled:opacity-50 transition"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            {ar ? "جاري الحجز..." : "Booking..."}
          </>
        ) : (
          <>
            <Calendar size={15} />
            {ar ? "تأكيد الحجز" : "Confirm booking"}
          </>
        )}
      </button>

      <p className="text-center text-xs text-white/20">
        {ar
          ? "بعد الحجز، قد يتواصل معك السكرتير للتأكيد"
          : "After booking, the secretary may contact you to confirm"}
      </p>
    </form>
  );
}
