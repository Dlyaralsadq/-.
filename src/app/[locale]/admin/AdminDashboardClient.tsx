"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope, ClipboardList, ShieldCheck, Plus, Key, Trash2,
  CheckCircle, XCircle, AlertCircle, UserCheck, UserX, Activity
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  createDoctorWithAccount, createAccountForDoctor,
  resetDoctorPassword, toggleDoctorStatus, deleteDoctorAndAccount,
  createSecretaryAccount,
} from "@/app/actions/admin";

interface Specialty { id: string; name: string; nameAr: string; }
interface Doctor {
  id: string; name: string; nameAr: string; phone: string | null;
  specialtyId: string; specialty: { name: string; nameAr: string };
  licenseNumber: string | null; experienceYears: number | null;
  consultationFee: number | null; workingDays: string | null;
  workingHoursStart: string | null; workingHoursEnd: string | null;
  isActive: boolean; userId: string | null;
  user: { id: string; username: string; isActive: boolean } | null;
  _count: { appointments: number; patients: number };
}
interface Stats { totalDoctors: number; activeDoctors: number; totalSpecialties: number; totalPatients: number; doctorsWithAccounts: number; }

const dayOptions = [
  { value: "sat-thu", label_ar: "السبت - الخميس", label_en: "Sat - Thu" },
  { value: "sun-thu", label_ar: "الأحد - الخميس", label_en: "Sun - Thu" },
  { value: "sat-wed", label_ar: "السبت - الأربعاء", label_en: "Sat - Wed" },
  { value: "mon-fri", label_ar: "الاثنين - الجمعة", label_en: "Mon - Fri" },
];

export default function AdminDashboardClient({ stats, doctors, specialties, locale }: {
  stats: Stats; doctors: Doctor[]; specialties: Specialty[]; locale: string;
}) {
  const router = useRouter();
  const ar = locale === "ar";

  const [addOpen, setAddOpen] = useState(false);
  const [accOpen, setAccOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3500); };

  const act = async (fn: () => Promise<{ success: boolean; error?: string }>) => {
    setLoading(true); setErrors({});
    const r = await fn();
    setLoading(false);
    if (r.success) { router.refresh(); return true; }
    if (r.error === "username_taken") setErrors({ username: ar ? "اسم المستخدم مستخدم بالفعل" : "Username taken" });
    return false;
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ok = await act(() => createDoctorWithAccount({
      name: fd.get("name") as string, nameAr: fd.get("nameAr") as string,
      phone: fd.get("phone") as string || undefined, email: fd.get("email") as string || undefined,
      specialtyId: fd.get("specialtyId") as string,
      licenseNumber: fd.get("licenseNumber") as string || undefined,
      experienceYears: fd.get("exp") ? parseInt(fd.get("exp") as string) : undefined,
      consultationFee: fd.get("fee") ? parseFloat(fd.get("fee") as string) : undefined,
      workingDays: fd.get("days") as string || undefined,
      workingHoursStart: fd.get("from") as string || undefined,
      workingHoursEnd: fd.get("to") as string || undefined,
      username: fd.get("username") as string,
      password: fd.get("password") as string,
    }));
    if (ok) { setAddOpen(false); showToast(ar ? "تم إضافة الطبيب وحسابه بنجاح" : "Doctor and account created"); }
  };

  const handleCreateAcc = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    const ok = await act(() => createAccountForDoctor(selected.id, fd.get("username") as string, fd.get("password") as string));
    if (ok) { setAccOpen(false); showToast(ar ? "تم إنشاء الحساب" : "Account created"); }
  };

  const handlePwd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    const ok = await act(() => resetDoctorPassword(selected.id, fd.get("password") as string));
    if (ok) { setPwdOpen(false); showToast(ar ? "تم تغيير كلمة المرور" : "Password updated"); }
  };

  const handleSec = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    const fd = new FormData(e.currentTarget);
    const ok = await act(() => createSecretaryAccount(selected.id, fd.get("username") as string, fd.get("password") as string, fd.get("name") as string));
    if (ok) { setSecOpen(false); showToast(ar ? "تم إنشاء حساب السكرتير" : "Secretary account created"); }
  };

  const specOpts = specialties.map(s => ({ value: s.id, label: ar ? s.nameAr : s.name }));
  const daysOpts = dayOptions.map(d => ({ value: d.value, label: ar ? d.label_ar : d.label_en }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 end-4 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 border border-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-2xl animate-slide-in">
          <CheckCircle className="h-4 w-4" />{toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-blue-400" />
            {ar ? "لوحة الإدارة" : "Admin Panel"}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">{ar ? "إدارة الأطباء والحسابات" : "Manage doctors and accounts"}</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />{ar ? "إضافة طبيب" : "Add Doctor"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: stats.totalDoctors, label: ar ? "الأطباء" : "Doctors", icon: Stethoscope, color: "indigo" },
          { n: stats.activeDoctors, label: ar ? "نشطون" : "Active", icon: Activity, color: "emerald" },
          { n: stats.totalSpecialties, label: ar ? "التخصصات" : "Specialties", icon: ClipboardList, color: "violet" },
          { n: stats.doctorsWithAccounts, label: ar ? "لديهم حسابات" : "With Accounts", icon: ShieldCheck, color: "blue" },
        ].map(({ n, label, icon: Icon, color }) => (
          <div key={label} className="card-premium p-4 hover:border-white/12 transition-colors">
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-${color}-500/10`}>
              <Icon className={`h-4.5 w-4.5 text-${color}-400`} />
            </div>
            <p className="text-2xl font-black text-white">{n}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Doctors table */}
      <div className="card-premium overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2536]">
          <h2 className="text-sm font-semibold text-white">{ar ? "الأطباء المسجلون" : "Registered Doctors"}</h2>
          <span className="text-xs text-slate-500">{doctors.length} {ar ? "طبيب" : "doctors"}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{ar ? "الطبيب" : "Doctor"}</th>
                <th>{ar ? "التخصص" : "Specialty"}</th>
                <th>{ar ? "الهاتف" : "Phone"}</th>
                <th>{ar ? "المواعيد/المرضى" : "Appts/Patients"}</th>
                <th>{ar ? "حساب النظام" : "Account"}</th>
                <th>{ar ? "الحالة" : "Status"}</th>
                <th className="text-center">{ar ? "إجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-600">{ar ? "لا يوجد أطباء" : "No doctors"}</td></tr>
              ) : doctors.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/20 text-indigo-300 font-bold text-sm">
                        {doc.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{ar ? doc.nameAr : doc.name}</p>
                        <p className="text-xs text-slate-600">{ar ? doc.name : doc.nameAr}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-xs text-indigo-300">
                      {ar ? doc.specialty.nameAr : doc.specialty.name}
                    </span>
                  </td>
                  <td className="text-sm text-slate-400">{doc.phone ?? "—"}</td>
                  <td className="text-sm text-slate-400">
                    <span className="font-semibold text-white">{doc._count.appointments}</span>
                    <span className="text-slate-600 mx-1">/</span>
                    <span>{doc._count.patients}</span>
                  </td>
                  <td>
                    {doc.user ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                          <code className="text-xs text-slate-300 font-mono">@{doc.user.username}</code>
                        </div>
                        <span className={`text-xs ${doc.user.isActive ? "text-emerald-400" : "text-red-400"}`}>
                          {doc.user.isActive ? (ar ? "نشط" : "Active") : (ar ? "معطل" : "Disabled")}
                        </span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5" />{ar ? "لا حساب" : "No account"}
                      </span>
                    )}
                  </td>
                  <td>
                    <Badge variant={doc.isActive ? "success" : "default"}>
                      {doc.isActive ? (ar ? "نشط" : "Active") : (ar ? "معطل" : "Inactive")}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      {!doc.user ? (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-blue-400 hover:bg-blue-500/10 gap-1"
                          onClick={() => { setSelected(doc); setAccOpen(true); }}>
                          <ShieldCheck className="h-3.5 w-3.5" />{ar ? "حساب" : "Account"}
                        </Button>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-amber-400 hover:bg-amber-500/10"
                            title={ar ? "تغيير كلمة المرور" : "Reset password"}
                            onClick={() => { setSelected(doc); setPwdOpen(true); }}>
                            <Key className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-violet-400 hover:bg-violet-500/10 gap-1"
                            onClick={() => { setSelected(doc); setSecOpen(true); }}>
                            <ClipboardList className="h-3.5 w-3.5" />{ar ? "سكرتير" : "Secretary"}
                          </Button>
                        </>
                      )}
                      {doc.isActive ? (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-orange-400 hover:bg-orange-500/10"
                          title={ar ? "إيقاف الحساب" : "Suspend account"}
                          onClick={async () => { await toggleDoctorStatus(doc.id, false); router.refresh(); }}>
                          <UserX className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-emerald-400 hover:bg-emerald-500/10"
                          title={ar ? "تأكيد الدفع وإعادة التفعيل" : "Confirm payment & reactivate"}
                          onClick={async () => { await toggleDoctorStatus(doc.id, true); router.refresh(); }}>
                          <UserCheck className="h-3.5 w-3.5" />
                          <span className="text-xs hidden sm:inline">{ar ? "تفعيل" : "Activate"}</span>
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteId(doc.id)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      <Modal isOpen={addOpen} onClose={() => { setAddOpen(false); setErrors({}); }}
        title={ar ? "إضافة طبيب جديد" : "Add New Doctor"} size="xl"
        footer={<>
          <Button variant="secondary" onClick={() => setAddOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="add-form" loading={loading}>{ar ? "إضافة" : "Add"}</Button>
        </>}>
        <form id="add-form" onSubmit={handleAdd} className="space-y-4">
          <div className="rounded-xl bg-indigo-500/8 border border-indigo-500/20 p-4 space-y-3">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Stethoscope className="h-3.5 w-3.5" />{ar ? "بيانات الطبيب" : "Doctor Info"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input name="nameAr" label={ar ? "الاسم بالعربية" : "الاسم بالعربية"} required placeholder="د. محمد الأحمدي" />
              <Input name="name" label={ar ? "الاسم بالإنجليزية" : "Full Name"} required placeholder="Dr. Mohammed Al-Ahmadi" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select name="specialtyId" label={ar ? "التخصص" : "Specialty"} options={specOpts} placeholder={ar ? "اختر" : "Select"} required />
              <Input name="phone" type="tel" label={ar ? "الهاتف" : "Phone"} placeholder="+966 5x xxx xxxx" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input name="licenseNumber" label={ar ? "رقم الترخيص" : "License #"} />
              <Input name="exp" type="number" min="0" label={ar ? "سنوات الخبرة" : "Experience"} />
              <Input name="fee" type="number" min="0" label={ar ? "رسوم الكشف" : "Consult. Fee"} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Select name="days" label={ar ? "أيام العمل" : "Working Days"} options={daysOpts} placeholder={ar ? "اختر" : "Select"} />
              <Input name="from" type="time" label={ar ? "من" : "From"} defaultValue="08:00" />
              <Input name="to" type="time" label={ar ? "إلى" : "To"} defaultValue="16:00" />
            </div>
          </div>
          <div className="rounded-xl bg-emerald-500/8 border border-emerald-500/20 p-4 space-y-3">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />{ar ? "حساب الدخول" : "Login Account"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Input name="username" label={ar ? "اسم المستخدم" : "Username"} required error={errors.username} placeholder="dr.username" />
              <Input name="password" type="password" label={ar ? "كلمة المرور" : "Password"} required placeholder="••••••••" />
            </div>
          </div>
        </form>
      </Modal>

      {/* Create account modal */}
      <Modal isOpen={accOpen} onClose={() => { setAccOpen(false); setErrors({}); }}
        title={`${ar ? "إنشاء حساب لـ" : "Create account for"} ${ar ? selected?.nameAr : selected?.name}`}
        size="sm" footer={<>
          <Button variant="secondary" onClick={() => setAccOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="acc-form" loading={loading}>{ar ? "إنشاء" : "Create"}</Button>
        </>}>
        <form id="acc-form" onSubmit={handleCreateAcc} className="space-y-3">
          <Input name="username" label={ar ? "اسم المستخدم" : "Username"} required error={errors.username} placeholder="dr.username" />
          <Input name="password" type="password" label={ar ? "كلمة المرور" : "Password"} required placeholder="••••••••" />
        </form>
      </Modal>

      {/* Reset password */}
      <Modal isOpen={pwdOpen} onClose={() => setPwdOpen(false)}
        title={`${ar ? "كلمة مرور جديدة لـ" : "New password for"} @${selected?.user?.username}`}
        size="sm" footer={<>
          <Button variant="secondary" onClick={() => setPwdOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="pwd-form" loading={loading}>{ar ? "حفظ" : "Save"}</Button>
        </>}>
        <form id="pwd-form" onSubmit={handlePwd} className="space-y-3">
          <Input name="password" type="password" label={ar ? "كلمة المرور الجديدة" : "New Password"} required placeholder="••••••••" />
        </form>
      </Modal>

      {/* Secretary account */}
      <Modal isOpen={secOpen} onClose={() => { setSecOpen(false); setErrors({}); }}
        title={`${ar ? "إضافة سكرتير لـ" : "Add secretary for"} ${ar ? selected?.nameAr : selected?.name}`}
        size="sm" footer={<>
          <Button variant="secondary" onClick={() => setSecOpen(false)} disabled={loading}>{ar ? "إلغاء" : "Cancel"}</Button>
          <Button type="submit" form="sec-form" loading={loading}>{ar ? "إنشاء" : "Create"}</Button>
        </>}>
        <form id="sec-form" onSubmit={handleSec} className="space-y-3">
          <Input name="name" label={ar ? "الاسم" : "Name"} required placeholder={ar ? "اسم السكرتير" : "Secretary name"} />
          <Input name="username" label={ar ? "اسم المستخدم" : "Username"} required error={errors.username} placeholder="secretary.name" />
          <Input name="password" type="password" label={ar ? "كلمة المرور" : "Password"} required placeholder="••••••••" />
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)}
        onConfirm={async () => { setLoading(true); await deleteDoctorAndAccount(deleteId!); setDeleteId(null); setLoading(false); router.refresh(); }}
        loading={loading}
        title={ar ? "حذف الطبيب وحسابه" : "Delete Doctor & Account"}
        message={ar ? "سيُحذف الطبيب وحساب دخوله نهائياً." : "Doctor and their account will be permanently deleted."} />
    </div>
  );
}
