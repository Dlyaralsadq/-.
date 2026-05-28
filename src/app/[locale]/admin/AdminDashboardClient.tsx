"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope, Users, ClipboardList, UserCheck,
  UserX, Plus, Key, Trash2, CheckCircle, XCircle,
  ShieldCheck, Activity, TrendingUp, AlertCircle
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
  updateDoctorAndAccount,
} from "@/app/actions/admin";

interface Specialty { id: string; name: string; nameAr: string; }
interface Doctor {
  id: string; name: string; nameAr: string;
  phone: string | null; email: string | null;
  specialtyId: string;
  specialty: { name: string; nameAr: string };
  licenseNumber: string | null;
  experienceYears: number | null;
  consultationFee: number | null;
  workingDays: string | null;
  workingHoursStart: string | null;
  workingHoursEnd: string | null;
  isActive: boolean;
  userId: string | null;
  user: { id: string; username: string; isActive: boolean; createdAt: Date } | null;
  _count: { appointments: number; patients: number };
}

interface Stats {
  totalDoctors: number; activeDoctors: number;
  totalSpecialties: number; totalPatients: number; doctorsWithAccounts: number;
}

export default function AdminDashboardClient({
  stats, doctors, specialties, locale,
}: {
  stats: Stats; doctors: Doctor[]; specialties: Specialty[]; locale: string;
}) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const td = useTranslations("doctors");
  const router = useRouter();

  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [createAccountOpen, setCreateAccountOpen] = useState(false);
  const [resetPwdOpen, setResetPwdOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState("");

  const specialtyOptions = specialties.map((s) => ({
    value: s.id,
    label: locale === "ar" ? s.nameAr : s.name,
  }));

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // ── Add Doctor + Account ──
  const handleAddDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setErrors({});
    const fd = new FormData(e.currentTarget);
    const result = await createDoctorWithAccount({
      name: fd.get("name") as string,
      nameAr: fd.get("nameAr") as string,
      phone: fd.get("phone") as string || undefined,
      email: fd.get("email") as string || undefined,
      specialtyId: fd.get("specialtyId") as string,
      licenseNumber: fd.get("licenseNumber") as string || undefined,
      qualification: fd.get("qualification") as string || undefined,
      experienceYears: fd.get("experienceYears") ? parseInt(fd.get("experienceYears") as string) : undefined,
      consultationFee: fd.get("consultationFee") ? parseFloat(fd.get("consultationFee") as string) : undefined,
      workingDays: fd.get("workingDays") as string || undefined,
      workingHoursStart: fd.get("workingHoursStart") as string || undefined,
      workingHoursEnd: fd.get("workingHoursEnd") as string || undefined,
      username: fd.get("username") as string,
      password: fd.get("password") as string,
    });
    setLoading(false);
    if (result.success) {
      setAddDoctorOpen(false);
      showSuccess(t("doctorAddedWithAccount"));
      router.refresh();
    } else {
      setErrors({ username: result.error === "username_taken" ? (locale === "ar" ? "اسم المستخدم مستخدم بالفعل" : "Username already taken") : tc("error") });
    }
  };

  // ── Create Account for existing doctor ──
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setLoading(true); setErrors({});
    const fd = new FormData(e.currentTarget);
    const result = await createAccountForDoctor(
      selectedDoctor.id,
      fd.get("username") as string,
      fd.get("password") as string,
    );
    setLoading(false);
    if (result.success) {
      setCreateAccountOpen(false);
      showSuccess(locale === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully");
      router.refresh();
    } else {
      setErrors({ username: result.error === "username_taken" ? (locale === "ar" ? "اسم المستخدم مستخدم" : "Username taken") : tc("error") });
    }
  };

  // ── Reset Password ──
  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    await resetDoctorPassword(selectedDoctor.id, fd.get("password") as string);
    setLoading(false);
    setResetPwdOpen(false);
    showSuccess(locale === "ar" ? "تم تغيير كلمة المرور" : "Password updated");
  };

  // ── Toggle Status ──
  const handleToggleStatus = async (doctor: Doctor) => {
    await toggleDoctorStatus(doctor.id, !doctor.isActive);
    router.refresh();
  };

  // ── Delete ──
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setLoading(true);
    await deleteDoctorAndAccount(deleteConfirm);
    setDeleteConfirm(null);
    setLoading(false);
    router.refresh();
  };

  const dayLabels: Record<string, string> = {
    "sat-thu": locale === "ar" ? "السبت - الخميس" : "Sat - Thu",
    "sun-thu": locale === "ar" ? "الأحد - الخميس" : "Sun - Thu",
    "sat-wed": locale === "ar" ? "السبت - الأربعاء" : "Sat - Wed",
    "mon-fri": locale === "ar" ? "الاثنين - الجمعة" : "Mon - Fri",
  };

  const dayOptions = Object.entries(dayLabels).map(([value, label]) => ({ value, label }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed top-4 end-4 z-50 flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("subtitle")}</p>
        </div>
        <Button onClick={() => setAddDoctorOpen(true)} size="lg">
          <Plus className="h-5 w-5" />
          {t("addDoctor")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("totalDoctors"), value: stats.totalDoctors, icon: Stethoscope, color: "blue" },
          { label: t("activeDoctors"), value: stats.activeDoctors, icon: Activity, color: "green" },
          { label: t("totalSpecialties"), value: stats.totalSpecialties, icon: ClipboardList, color: "purple" },
          { label: t("doctorAccounts"), value: stats.doctorsWithAccounts, icon: ShieldCheck, color: "orange" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-${color}-50`}>
              <Icon className={`h-5 w-5 text-${color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Doctors Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-600" />
            {t("doctorsList")}
          </h2>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            {doctors.length} {locale === "ar" ? "طبيب" : "doctors"}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>{td("fullName")}</th>
                <th>{td("specialty")}</th>
                <th>{tc("phone")}</th>
                <th>{locale === "ar" ? "المواعيد / المرضى" : "Appts / Patients"}</th>
                <th>{locale === "ar" ? "حساب النظام" : "System Account"}</th>
                <th>{tc("status")}</th>
                <th className="text-center">{tc("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Stethoscope className="mx-auto h-10 w-10 mb-3 opacity-20" />
                    <p>{tc("noData")}</p>
                  </td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm">
                          {doc.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{locale === "ar" ? doc.nameAr : doc.name}</p>
                          <p className="text-xs text-gray-400">{locale === "ar" ? doc.name : doc.nameAr}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {locale === "ar" ? doc.specialty.nameAr : doc.specialty.name}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600">{doc.phone ?? "—"}</td>
                    <td>
                      <span className="text-sm font-semibold text-gray-700">
                        {doc._count.appointments}
                      </span>
                      <span className="mx-1 text-gray-300">/</span>
                      <span className="text-sm text-gray-500">{doc._count.patients}</span>
                    </td>
                    <td>
                      {doc.user ? (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-xs font-mono font-semibold text-gray-700">@{doc.user.username}</span>
                          </div>
                          <Badge variant={doc.user.isActive ? "success" : "danger"} className="text-xs w-fit">
                            {doc.user.isActive ? tc("active") : tc("inactive")}
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-xs font-medium">{t("noAccount")}</span>
                        </div>
                      )}
                    </td>
                    <td>
                      <Badge variant={doc.isActive ? "success" : "default"}>
                        {doc.isActive ? tc("active") : tc("inactive")}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        {/* Create / manage account */}
                        {!doc.user ? (
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 px-2 text-xs text-blue-600 hover:bg-blue-50 gap-1"
                            onClick={() => { setSelectedDoctor(doc); setCreateAccountOpen(true); }}
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />
                            {t("createAccount")}
                          </Button>
                        ) : (
                          <Button
                            variant="ghost" size="sm"
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50"
                            title={t("resetPassword")}
                            onClick={() => { setSelectedDoctor(doc); setResetPwdOpen(true); }}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Toggle active */}
                        <Button
                          variant="ghost" size="sm"
                          className={`h-8 w-8 p-0 ${doc.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}`}
                          title={doc.isActive ? t("deactivate") : t("activate")}
                          onClick={() => handleToggleStatus(doc)}
                        >
                          {doc.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        {/* Delete */}
                        <Button
                          variant="ghost" size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                          onClick={() => setDeleteConfirm(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Add Doctor + Account ── */}
      <Modal
        isOpen={addDoctorOpen}
        onClose={() => { setAddDoctorOpen(false); setErrors({}); }}
        title={t("addDoctor")}
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setAddDoctorOpen(false); setErrors({}); }} disabled={loading}>{tc("cancel")}</Button>
            <Button type="submit" form="add-doctor-form" loading={loading}>{tc("save")}</Button>
          </>
        }
      >
        <form id="add-doctor-form" onSubmit={handleAddDoctor} className="space-y-5">
          {/* Section: Doctor Info */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
            <p className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {locale === "ar" ? "بيانات الطبيب" : "Doctor Information"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="nameAr" label={locale === "ar" ? "الاسم بالعربية" : "الاسم بالعربية"} required placeholder="د. محمد الأحمدي" />
              <Input name="name" label={locale === "ar" ? "الاسم بالإنجليزية" : "Full Name"} required placeholder="Dr. Mohammed Al-Ahmadi" />
              <Select name="specialtyId" label={td("specialty")} options={specialtyOptions} placeholder={locale === "ar" ? "اختر التخصص" : "Select specialty"} required error={errors.specialtyId} />
              <Input name="phone" type="tel" label={tc("phone")} placeholder="+966 5x xxx xxxx" />
              <Input name="email" type="email" label={tc("email")} placeholder="doctor@clinic.com" />
              <Input name="licenseNumber" label={td("licenseNumber")} />
              <Input name="experienceYears" type="number" min="0" label={td("experience")} />
              <Input name="consultationFee" type="number" min="0" label={td("consultationFee")} />
              <Select name="workingDays" label={td("workingDays")} options={dayOptions} placeholder={locale === "ar" ? "اختر أيام العمل" : "Select days"} />
              <div className="grid grid-cols-2 gap-2">
                <Input name="workingHoursStart" type="time" label={locale === "ar" ? "من" : "From"} defaultValue="08:00" />
                <Input name="workingHoursEnd" type="time" label={locale === "ar" ? "إلى" : "To"} defaultValue="16:00" />
              </div>
            </div>
          </div>

          {/* Section: Account */}
          <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
            <p className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {locale === "ar" ? "حساب الدخول للطبيب" : "Doctor Login Account"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input name="username" label={t("accountUsername")} required error={errors.username} placeholder={locale === "ar" ? "مثال: dr.mohammed" : "e.g. dr.mohammed"} />
              <Input name="password" type="password" label={t("accountPassword")} required placeholder="••••••••" />
            </div>
            <p className="mt-2 text-xs text-green-600">
              {locale === "ar" ? "سيستخدم الطبيب هذه البيانات لتسجيل الدخول ورؤية مرضاه ومواعيده فقط" : "The doctor will use these credentials to log in and see only their patients and appointments"}
            </p>
          </div>
        </form>
      </Modal>

      {/* ── Modal: Create Account for existing doctor ── */}
      <Modal
        isOpen={createAccountOpen}
        onClose={() => { setCreateAccountOpen(false); setErrors({}); }}
        title={`${t("createAccount")} — ${locale === "ar" ? selectedDoctor?.nameAr : selectedDoctor?.name}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setCreateAccountOpen(false); setErrors({}); }} disabled={loading}>{tc("cancel")}</Button>
            <Button type="submit" form="create-account-form" loading={loading}>{t("createAccount")}</Button>
          </>
        }
      >
        <form id="create-account-form" onSubmit={handleCreateAccount} className="space-y-4">
          <Input name="username" label={t("accountUsername")} required error={errors.username} placeholder="dr.username" />
          <Input name="password" type="password" label={t("accountPassword")} required placeholder="••••••••" />
          <p className="text-xs text-gray-400">
            {locale === "ar" ? "سيتمكن الطبيب من الدخول بهذه البيانات" : "The doctor will use these credentials to sign in"}
          </p>
        </form>
      </Modal>

      {/* ── Modal: Reset Password ── */}
      <Modal
        isOpen={resetPwdOpen}
        onClose={() => setResetPwdOpen(false)}
        title={`${t("resetPassword")} — @${selectedDoctor?.user?.username}`}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetPwdOpen(false)} disabled={loading}>{tc("cancel")}</Button>
            <Button type="submit" form="reset-pwd-form" loading={loading}>{t("resetPassword")}</Button>
          </>
        }
      >
        <form id="reset-pwd-form" onSubmit={handleResetPassword} className="space-y-4">
          <Input name="password" type="password" label={t("newPassword")} required placeholder="••••••••" />
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        loading={loading}
        title={locale === "ar" ? "حذف الطبيب وحسابه" : "Delete Doctor & Account"}
        message={locale === "ar" ? "سيتم حذف بيانات الطبيب وحساب الدخول الخاص به نهائياً." : "This will permanently delete the doctor and their login account."}
      />
    </div>
  );
}
