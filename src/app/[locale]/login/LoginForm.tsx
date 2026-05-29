"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Eye, EyeOff, Lock, User2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const ar = locale === "ar";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const result = await loginAction(new FormData(e.currentTarget));
    if (result.success) {
      router.push(`/${locale}/${result.role === "doctor" ? "doctor" : result.role === "secretary" ? "secretary" : "admin"}`);
      router.refresh();
    } else {
      setError(ar ? "اسم المستخدم أو كلمة المرور غير صحيحة" : "Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <div className="space-y-1.5">
        <label className="form-label">{ar ? "اسم المستخدم" : "Username"}</label>
        <div className="relative">
          <User2 className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-500" />
          <input name="username" type="text" required autoComplete="username"
            className="form-input ps-9 pe-4" placeholder={ar ? "اسم المستخدم" : "username"} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="form-label">{ar ? "كلمة المرور" : "Password"}</label>
        <div className="relative">
          <Lock className="absolute inset-y-0 start-3 my-auto h-4 w-4 text-slate-500" />
          <input name="password" type={showPwd ? "text" : "password"} required autoComplete="current-password"
            className="form-input ps-9 pe-10" placeholder="••••••••" />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
            className="absolute inset-y-0 end-3 my-auto text-slate-500 hover:text-slate-300">
            {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {ar ? "تسجيل الدخول" : "Sign In"}
      </Button>

      <div className="rounded-xl bg-slate-800/40 border border-[#2a3347] p-3 space-y-1.5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{ar ? "بيانات تجريبية" : "Demo Credentials"}</p>
        <div className="space-y-1 text-xs text-slate-500">
          <p><span className="text-slate-400">Admin:</span> <code className="text-indigo-400">admin</code> / <code className="text-indigo-400">admin123</code></p>
          <p><span className="text-slate-400">Doctor:</span> <code className="text-indigo-400">dr.ahmad</code> / <code className="text-indigo-400">admin123</code></p>
          <p><span className="text-slate-400">Secretary:</span> <code className="text-indigo-400">secretary1</code> / <code className="text-indigo-400">admin123</code></p>
        </div>
      </div>
    </form>
  );
}
