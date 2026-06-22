"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Image, Monitor, ClipboardList, Stethoscope, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface DoctorSettingsClientProps {
  doctor: {
    id: string; name: string; nameAr: string; logoUrl?: string | null;
    logoBackground?: boolean; logoBgOnDoctor?: boolean;
    logoBgOnSecretary?: boolean; logoBgOnWaiting?: boolean;
  };
  locale: string;
}

async function updateDoctorSettings(doctorId: string, data: Record<string, unknown>) {
  const res = await fetch("/api/doctor/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doctorId, ...data }),
  });
  return res.ok;
}

export default function DoctorSettingsClient({ doctor, locale }: DoctorSettingsClientProps) {
  const router = useRouter();
  const ar = locale === "ar";
  const logoRef = useRef<HTMLInputElement>(null);

  const [logo, setLogo] = useState<string | null>(doctor.logoUrl ?? null);
  const [bgEnabled, setBgEnabled] = useState(doctor.logoBackground ?? false);
  const [onDoctor, setOnDoctor] = useState(doctor.logoBgOnDoctor ?? true);
  const [onSecretary, setOnSecretary] = useState(doctor.logoBgOnSecretary ?? false);
  const [onWaiting, setOnWaiting] = useState(doctor.logoBgOnWaiting ?? false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateDoctorSettings(doctor.id, {
      logoUrl: logo,
      logoBackground: bgEnabled,
      logoBgOnDoctor: onDoctor,
      logoBgOnSecretary: onSecretary,
      logoBgOnWaiting: onWaiting,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    router.refresh();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-white">{ar ? "إعدادات الطبيب" : "Doctor Settings"}</h1>
        <p className="text-sm text-white/30 mt-1">{ar ? "تخصيص الشعار والمظهر" : "Customize your logo and appearance"}</p>
      </div>

      {/* Logo section */}
      <div className="card-premium p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Camera className="h-4 w-4 text-indigo-400" />
          {ar ? "شعار العيادة" : "Clinic Logo"}
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600/15 border border-indigo-500/20 overflow-hidden text-3xl">
              {logo ? <img src={logo} alt="logo" className="h-full w-full object-cover" /> : "🩺"}
            </div>
            <button onClick={() => logoRef.current?.click()}
              className="absolute -bottom-1 -end-1 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 border-2 border-[#0f1629] text-white hover:bg-indigo-500 transition-colors">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            <button onClick={() => logoRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors">
              <Camera className="h-4 w-4" />
              {ar ? "تغيير الشعار" : "Change Logo"}
            </button>
            {logo && (
              <button onClick={() => setLogo(null)}
                className="text-xs text-rose-400 hover:text-rose-300 transition-colors">
                {ar ? "حذف الشعار" : "Remove Logo"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Background logo */}
      <div className="card-premium p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Image className="h-4 w-4 text-violet-400" />
            {ar ? "عرض الشعار في الخلفية" : "Logo as Background"}
          </h2>
          <label className="relative cursor-pointer">
            <input type="checkbox" checked={bgEnabled} onChange={e => setBgEnabled(e.target.checked)} className="sr-only peer" />
            <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
            <div className="absolute top-0.5 start-0.5 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5" />
          </label>
        </div>

        {bgEnabled && logo && (
          <div className="space-y-3">
            <p className="text-xs text-white/40">{ar ? "اختر أين يظهر الشعار في الخلفية" : "Choose where to show background logo"}</p>
            {[
              { key: "onDoctor", label_ar: "لوحة الطبيب", label_en: "Doctor Dashboard", icon: Stethoscope, state: onDoctor, set: setOnDoctor },
              { key: "onSecretary", label_ar: "واجهة الاستقبال", label_en: "Secretary Screen", icon: ClipboardList, state: onSecretary, set: setOnSecretary },
              { key: "onWaiting", label_ar: "شاشة الانتظار", label_en: "Waiting Room Screen", icon: Monitor, state: onWaiting, set: setOnWaiting },
            ].map(({ label_ar, label_en, icon: Icon, state, set }) => (
              <label key={label_en} className="flex items-center gap-3 cursor-pointer rounded-xl p-3 hover:bg-white/4 transition-colors">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${state ? "bg-indigo-500/20 border border-indigo-500/30" : "bg-white/5 border border-white/8"}`}>
                  <Icon className={`h-4 w-4 ${state ? "text-indigo-400" : "text-white/30"}`} />
                </div>
                <span className="flex-1 text-sm text-slate-300">{ar ? label_ar : label_en}</span>
                <input type="checkbox" checked={state} onChange={e => set(e.target.checked)} className="sr-only peer" />
                <div className={`w-8 h-4 rounded-full transition-colors ${state ? "bg-indigo-600" : "bg-white/10"}`}>
                  <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-all ${state ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
              </label>
            ))}

            {/* Preview */}
            {logo && (
              <div className="rounded-xl overflow-hidden border border-white/8 h-24 relative">
                <img src={logo} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-xs text-white/40">{ar ? "معاينة" : "Preview"}</p>
                </div>
                <img src={logo} alt="logo" className="absolute bottom-2 end-2 h-10 w-10 rounded-xl object-cover border border-white/20" />
              </div>
            )}
          </div>
        )}
      </div>

      <Button onClick={handleSave} loading={saving} className="w-full gap-2">
        {saved ? <><Check className="h-4 w-4" />{ar ? "تم الحفظ!" : "Saved!"}</> : (ar ? "حفظ الإعدادات" : "Save Settings")}
      </Button>
    </div>
  );
}
