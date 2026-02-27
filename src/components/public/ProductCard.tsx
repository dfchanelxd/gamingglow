"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Star, HardDrive, Gamepad2, Code2 } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

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
  releases?: { version: string; fileSize: number; downloadCount: number; isLatest?: boolean }[];
}

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact";
  className?: string;
}

export function ProductCard({ product, variant = "default", className }: ProductCardProps) {
  const latestRelease = product.releases?.find((r) => r.isLatest) || product.releases?.[0];
  const coverImage = product.images?.find((i) => i.type === "cover")?.url || 
    `/images/placeholder-${product.type}.jpg`;

  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        className={cn("group", className)}
      >
        <Link href={`/${product.type === "game" ? "games" : "software"}/${product.slug}`}>
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden glass">
            {/* Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-transparent" />
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neon-blue/20 text-neon-blue">
                  {product.category}
                </span>
                {product.staff_pick && (
                  <Star className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-slate-400 text-sm line-clamp-2">{product.tagline}</p>
              
              {latestRelease && (
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {latestRelease.downloadCount?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {formatBytes(latestRelease.fileSize || 0)}
                  </span>
                </div>
              )}
            </div>

            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/20 to-transparent" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn("group", className)}
    >
      <Link href={`/${product.type === "game" ? "games" : "software"}/${product.slug}`}>
        <div className="glass rounded-2xl overflow-hidden card-hover">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${coverImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1",
                product.type === "game" 
                  ? "bg-neon-magenta/20 text-neon-magenta" 
                  : "bg-neon-blue/20 text-neon-blue"
              )}>
                {product.type === "game" ? <Gamepad2 className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
                {product.type === "game" ? "Game" : "Software"}
              </span>
              {product.featured && (
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-neon-yellow/20 text-neon-yellow">
                  Featured
                </span>
              )}
            </div>

            {product.staff_pick && (
              <div className="absolute top-3 right-3">
                <div className="w-8 h-8 rounded-lg bg-neon-yellow/20 flex items-center justify-center">
                  <Star className="w-4 h-4 text-neon-yellow fill-neon-yellow" />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-neon-cyan font-medium uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1 group-hover:text-neon-blue transition-colors">
              {product.title}
            </h3>
            
            <p className="text-slate-400 text-sm line-clamp-2 mb-4">
              {product.tagline}
            </p>

            {latestRelease && (
              <div className="flex items-center justify-between pt-4 border-t border-navy-700/50">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    {latestRelease.downloadCount?.toLocaleString() || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-4 h-4" />
                    {formatBytes(latestRelease.fileSize || 0)}
                  </span>
                </div>
                <span className="text-neon-blue text-sm font-medium group-hover:translate-x-1 transition-transform">
                  Download →
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
