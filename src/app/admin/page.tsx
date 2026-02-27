"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Gamepad2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  Shield,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      if (data.requires2FA) {
        setRequires2FA(true);
        return;
      }

      // Login successful
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handle2FASubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: twoFactorCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verifikasi 2FA gagal");
        return;
      }

      // Login successful
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="glass-strong rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue to-neon-magenta mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Admin <span className="text-neon-blue">Login</span>
            </h1>
            <p className="text-slate-400 text-sm">
              GAMINGGLOW Admin Dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {!requires2FA ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gamingglow.local"
                    className="input-glow pl-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-glow pl-12 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-5">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-neon-blue" />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  Verifikasi Dua Faktor
                </h2>
                <p className="text-slate-400 text-sm">
                  Masukkan kode 6 digit dari aplikasi authenticator Anda
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="input-glow text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || twoFactorCode.length !== 6}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  "Verifikasi"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequires2FA(false);
                  setTwoFactorCode("");
                }}
                className="w-full text-slate-400 hover:text-white text-sm transition-colors"
              >
                Kembali ke login
              </button>
            </form>
          )}

          {/* Security notice */}
          <div className="mt-6 pt-6 border-t border-navy-700/50">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="w-4 h-4" />
              <span>Login terenkripsi & diaudit</span>
            </div>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <Gamepad2 className="w-4 h-4" />
            Kembali ke beranda
          </a>
        </div>
      </motion.div>
    </div>
  );
}
