"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Download,
  Shield,
  AlertTriangle,
  HardDrive,
  Users,
  TrendingUp,
  Clock,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import Link from "next/link";

interface DashboardStats {
  downloadsToday: number;
  downloadsThisWeek: number;
  downloadsThisMonth: number;
  totalDownloads: number;
  totalProducts: number;
  pendingUploads: number;
  storageUsed: number;
  storageLimit: number;
  pendingDMCAClaims: number;
  recentDownloads: Array<{
    productTitle: string;
    version: string;
    timestamp: string;
    ipHash: string;
  }>;
  topProducts: Array<{
    id: string;
    title: string;
    slug: string;
    downloadCount: number;
    type: string;
  }>;
}

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produk", icon: Package },
  { href: "/admin/uploads", label: "Upload", icon: Download },
  { href: "/admin/moderation", label: "Moderasi", icon: Shield },
  { href: "/admin/dmca-claims", label: "DMCA", icon: AlertTriangle },
  { href: "/admin/settings", label: "Pengaturan", icon: HardDrive },
  { href: "/admin/logs", label: "Log", icon: Clock },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch("/api/admin/me");
      if (!response.ok) {
        router.push("/admin");
        return;
      }
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        fetchStats();
      } else {
        router.push("/admin");
      }
    } catch (error) {
      router.push("/admin");
    }
  }

  async function fetchStats() {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4" />
          <p className="text-slate-400">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 glass-strong border-r border-navy-700/50 transform transition-transform duration-300 lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-magenta flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              ADMIN<span className="text-neon-blue">PANEL</span>
            </span>
          </Link>

          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  link.href === "/admin/dashboard"
                    ? "bg-neon-blue/10 text-neon-blue"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-navy-700/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-navy-700/50">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: "Download Hari Ini",
                value: stats?.downloadsToday || 0,
                icon: Download,
                color: "text-neon-blue",
                bgColor: "bg-neon-blue/10",
              },
              {
                label: "Total Produk",
                value: stats?.totalProducts || 0,
                icon: Package,
                color: "text-neon-magenta",
                bgColor: "bg-neon-magenta/10",
              },
              {
                label: "Storage Terpakai",
                value: `${stats?.storageUsed || 0} GB`,
                icon: HardDrive,
                color: "text-neon-green",
                bgColor: "bg-neon-green/10",
              },
              {
                label: "DMCA Pending",
                value: stats?.pendingDMCAClaims || 0,
                icon: AlertTriangle,
                color: "text-neon-yellow",
                bgColor: "bg-neon-yellow/10",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Download Stats */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Statistik Download</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hari Ini</span>
                  <span className="font-semibold">{stats?.downloadsToday?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Minggu Ini</span>
                  <span className="font-semibold">{stats?.downloadsThisWeek?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Bulan Ini</span>
                  <span className="font-semibold">{stats?.downloadsThisMonth?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-navy-700/50">
                  <span className="text-slate-400">Total</span>
                  <span className="font-semibold text-neon-blue">{stats?.totalDownloads?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Storage Usage */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Penggunaan Storage</h2>
              <div className="relative h-4 bg-navy-800 rounded-full overflow-hidden mb-4">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-blue to-neon-magenta rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, ((stats?.storageUsed || 0) / (stats?.storageLimit || 1000)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {stats?.storageUsed || 0} GB digunakan
                </span>
                <span className="text-slate-400">
                  {stats?.storageLimit || 1000} GB total
                </span>
              </div>
            </div>
          </div>

          {/* Tables Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Produk Terpopuler</h2>
                <Link
                  href="/admin/products"
                  className="text-neon-blue text-sm hover:underline"
                >
                  Lihat Semua
                </Link>
              </div>
              <div className="space-y-4">
                {stats?.topProducts?.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center text-neon-blue font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.title}</p>
                        <p className="text-xs text-slate-500 capitalize">{product.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{product.downloadCount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">downloads</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Downloads */}
            <div className="glass rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-6">Download Terbaru</h2>
              <div className="space-y-4">
                {stats?.recentDownloads?.slice(0, 5).map((download, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-navy-800/50"
                  >
                    <div>
                      <p className="font-medium text-white">{download.productTitle}</p>
                      <p className="text-xs text-slate-500">v{download.version}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">
                        {new Date(download.timestamp).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-slate-600 font-mono">
                        {download.ipHash.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
