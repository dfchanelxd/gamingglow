import { Metadata } from "next";
import { Shield, CheckCircle2, Zap, Lock, Users, Globe } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Tentang GAMINGGLOW - Portal download game dan software PC legal",
};

const features = [
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description: "Semua file di-scan dengan antivirus dan terverifikasi checksum SHA-256 untuk memastikan keamanan.",
  },
  {
    icon: Zap,
    title: "Download Cepat",
    description: "Server CDN global untuk kecepatan download maksimal di mana saja Anda berada.",
  },
  {
    icon: Lock,
    title: "Legal & Resmi",
    description: "Hanya konten dengan izin distribusi resmi dari publisher dan developer terpercaya.",
  },
  {
    icon: Users,
    title: "Komunitas",
    description: "Bergabung dengan komunitas pengguna yang saling membantu dan berbagi pengalaman.",
  },
  {
    icon: Globe,
    title: "Akses Global",
    description: "Akses dari mana saja dengan dukungan multi-bahasa dan server di berbagai region.",
  },
  {
    icon: CheckCircle2,
    title: "Kualitas Terjamin",
    description: "Setiap produk melalui proses moderasi ketat sebelum dipublikasikan.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Tentang <span className="text-neon-blue">GAMINGGLOW</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              GAMINGGLOW adalah portal download game dan software PC yang berkomitmen 
              untuk menyediakan konten legal, aman, dan berkualitas tinggi untuk 
              pengguna di Indonesia dan seluruh dunia.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Misi <span className="text-neon-magenta">Kami</span>
              </h2>
              <div className="space-y-4 text-slate-400">
                <p>
                  Kami percaya bahwa akses terhadap software dan game berkualitas 
                  haruslah aman, legal, dan terjangkau. GAMINGGLOW didirikan dengan 
                  visi untuk menciptakan ekosistem distribusi digital yang adil 
                  bagi developer dan pengguna.
                </p>
                <p>
                  Setiap file yang tersedia di platform kami telah melalui proses 
                  verifikasi ketat, termasuk scan antivirus dan pemeriksaan checksum 
                  untuk memastikan integritas file.
                </p>
                <p>
                  Kami juga berkomitmen untuk menghormati hak kekayaan intelektual 
                  dan bekerja sama dengan developer serta publisher untuk memastikan 
                  distribusi yang sah.
                </p>
              </div>
            </div>
            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6">Nilai-Nilai Kami</h3>
              <ul className="space-y-4">
                {[
                  "Integritas dalam setiap tindakan",
                  "Keamanan sebagai prioritas utama",
                  "Transparansi dalam operasional",
                  "Inovasi berkelanjutan",
                  "Fokus pada pengalaman pengguna",
                ].map((value, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-neon-green/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-neon-green" />
                    </div>
                    <span className="text-slate-300">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Mengapa Memilih <span className="text-neon-cyan">Kami</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Kami menyediakan pengalaman download terbaik dengan berbagai keunggulan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-neon-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gradient-to-b from-navy-800 to-navy-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 sm:p-12">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "10,000+", label: "Downloads" },
                { value: "50+", label: "Produk" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-neon-blue mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Hubungi <span className="text-neon-magenta">Kami</span>
            </h2>
            <p className="text-slate-400 mb-8">
              Punya pertanyaan atau saran? Jangan ragu untuk menghubungi kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@gamingglow.local"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Email Support
              </a>
              <a
                href="/legal/dmca"
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Lapor DMCA
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
