"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Gamepad2, 
  Download, 
  Shield, 
  Zap, 
  ChevronRight,
  Star,
  Users,
  HardDrive,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { cn, formatBytes } from "@/lib/utils";

// Components
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ParticleBackground } from "@/components/public/ParticleBackground";
import { ProductCard } from "@/components/public/ProductCard";

interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  type: "game" | "software";
  category: string;
  featured: boolean;
  staff_pick: boolean;
  images?: { type: string; url: string }[];
  releases?: { version: string; fileSize: number; downloadCount: number }[];
}

interface Stats {
  totalDownloads: number;
  totalProducts: number;
  storageUsed: number;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [staffPicks, setStaffPicks] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDownloads: 0, totalProducts: 0, storageUsed: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Fetch featured products
      const featuredRes = await fetch("/api/public/products?featured=true&limit=6");
      const featuredData = await featuredRes.json();
      
      if (featuredData.success) {
        setFeaturedProducts(featuredData.data);
      }

      // Fetch staff picks
      const picksRes = await fetch("/api/public/products?staffPick=true&limit=4");
      const picksData = await picksRes.json();
      
      if (picksData.success) {
        setStaffPicks(picksData.data);
      }

      // Fetch stats
      const statsRes = await fetch("/api/public/stats");
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-navy-900">
      <ParticleBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <Shield className="w-4 h-4 text-neon-green" />
              <span className="text-sm text-slate-300">File Terverifikasi & Aman</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="text-white">Download Game &</span>
              <br />
              <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                Software PC Legal
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              File terverifikasi — checksum & scan antivirus — distribusi resmi.
              Cepat, aman, dan legal.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            >
              <Link
                href="/games"
                className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <Download className="w-5 h-5" />
                Download Sekarang
              </Link>
              <Link
                href="#featured"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <Gamepad2 className="w-5 h-5" />
                Lihat Katalog
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-neon-blue">
                  {stats.totalDownloads.toLocaleString()}+
                </div>
                <div className="text-sm text-slate-400">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-neon-magenta">
                  {stats.totalProducts}+
                </div>
                <div className="text-sm text-slate-400">Produk</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-neon-green">
                  {formatBytes(stats.storageUsed * 1024 * 1024 * 1024, 0)}
                </div>
                <div className="text-sm text-slate-400">Storage</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-slate-500 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-neon-blue rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Mengapa Memilih <span className="text-neon-blue">GAMINGGLOW</span>?
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Platform download terpercaya dengan keamanan dan kecepatan terbaik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Aman",
                description: "Semua file di-scan dengan antivirus dan terverifikasi checksum SHA-256",
                color: "text-neon-green",
              },
              {
                icon: Zap,
                title: "Download Cepat",
                description: "Server CDN global untuk kecepatan download maksimal di mana saja",
                color: "text-neon-yellow",
              },
              {
                icon: CheckCircle2,
                title: "Legal & Resmi",
                description: "Distribusi resmi dari publisher dan developer terpercaya",
                color: "text-neon-blue",
              },
              {
                icon: HardDrive,
                title: "Resume Support",
                description: "Pause dan lanjutkan download kapan saja tanpa kehilangan progress",
                color: "text-neon-magenta",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className={cn("w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center mb-4", feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2">
                Game <span className="text-neon-magenta">Unggulan</span>
              </h2>
              <p className="text-slate-400">Pilihan terbaik untuk pengalaman gaming epik</p>
            </div>
            <Link
              href="/games"
              className="hidden sm:inline-flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors"
            >
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="aspect-video skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-3/4 skeleton rounded" />
                    <div className="h-4 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 text-neon-blue hover:text-neon-cyan transition-colors"
            >
              Lihat Semua Game <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Staff Picks Section */}
      <section className="py-24 relative bg-gradient-to-b from-navy-900 to-navy-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-5 h-5 text-neon-yellow fill-neon-yellow" />
                <span className="text-neon-yellow font-medium">Staff Pick</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                Pilihan <span className="text-neon-cyan">Editor</span>
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] skeleton" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffPicks.map((product) => (
                <ProductCard key={product.id} product={product} variant="compact" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Siap untuk <span className="text-neon-magenta">Download</span>?
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                Bergabung dengan ribuan pengguna yang telah menikmati download 
                game dan software PC legal, cepat, dan aman.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/games" className="btn-primary text-lg px-8 py-4">
                  Jelajahi Game
                </Link>
                <Link href="/software" className="btn-secondary text-lg px-8 py-4">
                  Jelajahi Software
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
