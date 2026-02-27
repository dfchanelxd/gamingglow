"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  Clock, 
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { cn } from "@/lib/utils";

export default function DMCAPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    claimantName: "",
    claimantEmail: "",
    claimantAddress: "",
    productSlug: "",
    infringingMaterial: "",
    originalMaterial: "",
    goodFaithStatement: false,
    accuracyStatement: false,
    signature: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/report-dmca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting DMCA claim:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-yellow/10 mb-6">
              <Shield className="w-8 h-8 text-neon-yellow" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Kebijakan <span className="text-neon-yellow">DMCA</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              GAMINGGLOW menghormati hak kekayaan intelektual dan mematuhi 
              Digital Millennium Copyright Act (DMCA)
            </p>
          </div>

          {/* Process Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: FileText,
                title: "Ajukan Laporan",
                description: "Isi formulir DMCA dengan informasi lengkap",
                color: "text-neon-blue",
                bgColor: "bg-neon-blue/10",
              },
              {
                icon: Clock,
                title: "Tinjauan",
                description: "Tim kami meninjau dalam 24-48 jam",
                color: "text-neon-magenta",
                bgColor: "bg-neon-magenta/10",
              },
              {
                icon: CheckCircle2,
                title: "Tindak Lanjut",
                description: "Konten ditangguhkan jika valid",
                color: "text-neon-green",
                bgColor: "bg-neon-green/10",
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4", step.bgColor)}>
                  <step.icon className={cn("w-6 h-6", step.color)} />
                </div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Requirements */}
          <div className="glass rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-neon-yellow" />
              Persyaratan Laporan DMCA
            </h2>
            <p className="text-slate-400 mb-6">
              Untuk memproses laporan DMCA Anda, kami memerlukan informasi berikut:
            </p>
            <ul className="space-y-3">
              {[
                "Tanda tangan fisik atau elektronik dari pemilik hak cipta",
                "Identifikasi materi yang dilaporkan melanggar hak cipta",
                "Identifikasi materi asli yang dilindungi hak cipta",
                "Informasi kontak lengkap (nama, alamat, email, telepon)",
                "Pernyataan keyakinan baik bahwa penggunaan tidak diizinkan",
                "Pernyataan keakuratan informasi di bawah sumpah",
              ].map((req, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-neon-green flex-shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* DMCA Form */}
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6">Formulir Laporan DMCA</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.claimantName}
                      onChange={(e) => setFormData({ ...formData, claimantName: e.target.value })}
                      className="input-glow"
                      placeholder="Nama pemilik hak cipta"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.claimantEmail}
                      onChange={(e) => setFormData({ ...formData, claimantEmail: e.target.value })}
                      className="input-glow"
                      placeholder="email@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alamat Lengkap *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.claimantAddress}
                    onChange={(e) => setFormData({ ...formData, claimantAddress: e.target.value })}
                    className="input-glow resize-none"
                    placeholder="Alamat lengkap untuk korespondensi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    URL Produk di GAMINGGLOW (opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.productSlug}
                    onChange={(e) => setFormData({ ...formData, productSlug: e.target.value })}
                    className="input-glow"
                    placeholder="gamingglow.id/games/nama-game"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deskripsi Materi yang Melanggar *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.infringingMaterial}
                    onChange={(e) => setFormData({ ...formData, infringingMaterial: e.target.value })}
                    className="input-glow resize-none"
                    placeholder="Jelaskan dengan detail materi yang melanggar hak cipta Anda"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deskripsi Materi Asli yang Dilindungi *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.originalMaterial}
                    onChange={(e) => setFormData({ ...formData, originalMaterial: e.target.value })}
                    className="input-glow resize-none"
                    placeholder="Jelaskan dan berikan bukti kepemilikan hak cipta"
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.goodFaithStatement}
                      onChange={(e) => setFormData({ ...formData, goodFaithStatement: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-800 text-neon-blue focus:ring-neon-blue"
                    />
                    <span className="text-slate-400 text-sm">
                      Saya menyatakan dengan keyakinan baik bahwa penggunaan materi yang 
                      dilaporkan tidak diizinkan oleh pemilik hak cipta, agennya, atau hukum.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={formData.accuracyStatement}
                      onChange={(e) => setFormData({ ...formData, accuracyStatement: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-navy-600 bg-navy-800 text-neon-blue focus:ring-neon-blue"
                    />
                    <span className="text-slate-400 text-sm">
                      Saya menyatakan bahwa informasi dalam laporan ini akurat, dan 
                      saya adalah pemilik hak cipta atau berwenang untuk bertindak atas 
                      nama pemilik hak cipta.
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tanda Tangan Digital *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.signature}
                    onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                    className="input-glow"
                    placeholder="Ketik nama lengkap Anda sebagai tanda tangan digital"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Laporan DMCA
                    </>
                  )}
                </button>

                <p className="text-center text-slate-500 text-sm">
                  Peringatan: Penyalahgunaan proses DMCA dapat mengakibatkan tanggung jawab hukum.
                </p>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-neon-green" />
              </div>
              <h2 className="text-2xl font-semibold mb-4">Laporan Berhasil Dikirim</h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                Terima kasih telah melaporkan. Tim kami akan meninjau laporan Anda 
                dalam 24-48 jam. Anda akan menerima notifikasi email tentang status laporan.
              </p>
              <a href="/" className="btn-primary inline-flex items-center gap-2">
                Kembali ke Beranda
              </a>
            </motion.div>
          )}

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-slate-400">
              Untuk pertanyaan tentang DMCA, hubungi kami di:{" "}
              <a 
                href={`mailto:${process.env.NEXT_PUBLIC_DMCA_EMAIL || "dmca@gamingglow.local"}`}
                className="text-neon-blue hover:underline"
              >
                {process.env.NEXT_PUBLIC_DMCA_EMAIL || "dmca@gamingglow.local"}
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
