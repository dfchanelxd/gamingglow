"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gamepad2, 
  Menu, 
  X, 
  Search, 
  Download,
  Code2,
  Shield,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/games", label: "Game", icon: Gamepad2 },
  { href: "/software", label: "Software", icon: Code2 },
  { href: "/about", label: "Tentang", icon: Shield },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "glass-strong py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-magenta flex items-center justify-center group-hover:shadow-lg group-hover:shadow-neon-blue/30 transition-shadow">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-neon-blue/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                GAMING<span className="text-neon-blue">GLOW</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "nav-link px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2",
                    pathname === link.href
                      ? "text-white bg-neon-blue/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden"
          >
            <div className="glass-strong mx-4 rounded-2xl overflow-hidden border border-navy-600/50">
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                      pathname === link.href
                        ? "bg-neon-blue/10 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                ))}
                <hr className="border-navy-600/50 my-2" />
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-neon-blue hover:bg-neon-blue/10 transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  Admin Login
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
