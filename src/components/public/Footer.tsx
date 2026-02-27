"use client";

import Link from "next/link";
import { 
  Gamepad2, 
  Github, 
  Twitter, 
  Instagram, 
  Mail,
  Shield,
  FileText,
  Lock,
  AlertTriangle,
} from "lucide-react";

const footerLinks = {
  products: [
    { label: "Game PC", href: "/games" },
    { label: "Software", href: "/software" },
    { label: "Kategori", href: "/categories" },
    { label: "Staff Picks", href: "/staff-picks" },
  ],
  support: [
    { label: "Cara Download", href: "/help/download" },
    { label: "FAQ", href: "/help/faq" },
    { label: "Kontak", href: "/contact" },
    { label: "Report Bug", href: "/report-bug" },
  ],
  legal: [
    { label: "Syarat & Ketentuan", href: "/legal/terms" },
    { label: "Kebijakan Privasi", href: "/legal/privacy" },
    { label: "DMCA", href: "/legal/dmca" },
    { label: "Uploader Guidelines", href: "/legal/uploader" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com/gamingglow", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com/gamingglow", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com/gamingglow", label: "Instagram" },
  { icon: Mail, href: "mailto:support@gamingglow.local", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative bg-navy-900 border-t border-navy-700/50">
      {/* Uploader Notice Banner */}
      <div className="bg-gradient-to-r from-neon-blue/10 to-neon-magenta/10 border-b border-navy-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 justify-center text-sm text-slate-300">
            <AlertTriangle className="w-5 h-5 text-neon-yellow flex-shrink-0" />
            <p>
              <strong className="text-white">Penting:</strong> Hanya upload konten yang Anda miliki 
              hak untuk distribusikan. Pelanggaran akan dihapus dan dilaporkan.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-blue to-neon-magenta flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                GAMING<span className="text-neon-blue">GLOW</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Portal download game dan software PC legal, cepat, dan aman. 
              File terverifikasi dengan checksum & scan antivirus.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-neon-blue/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produk</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-neon-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Bantuan</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-neon-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-neon-blue transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security Badges */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Keamanan</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Shield className="w-4 h-4 text-neon-green" />
                <span>SHA-256 Verified</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Lock className="w-4 h-4 text-neon-blue" />
                <span>HTTPS Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <FileText className="w-4 h-4 text-neon-magenta" />
                <span>DMCA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} GAMINGGLOW. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                Semua sistem normal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
