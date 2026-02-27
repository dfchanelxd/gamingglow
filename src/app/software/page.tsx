"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Search, Filter } from "lucide-react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProductCard } from "@/components/public/ProductCard";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  type: "software";
  category: string;
  featured: boolean;
  staff_pick: boolean;
  images?: { type: string; url: string }[];
  releases?: { version: string; fileSize: number; downloadCount: number }[];
}

const categories = [
  "Semua",
  "Productivity",
  "Multimedia",
  "Utility",
  "Security",
  "Development",
];

export default function SoftwarePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSoftware();
  }, [selectedCategory]);

  async function fetchSoftware() {
    try {
      const params = new URLSearchParams();
      params.append("type", "software");
      params.append("limit", "50");
      
      if (selectedCategory !== "Semua") {
        params.append("category", selectedCategory.toLowerCase());
      }

      const response = await fetch(`/api/public/products?${params}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error("Error fetching software:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
              <Code2 className="w-6 h-6 text-neon-blue" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="text-neon-blue">Software</span> PC
            </h1>
          </div>
          <p className="text-slate-400 max-w-2xl">
            Koleksi software PC legal untuk produktivitas, kreativitas, dan keamanan. 
            Download cepat dan terverifikasi.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-navy-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              <Filter className="w-5 h-5 text-slate-500 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === category
                      ? "bg-neon-blue/20 text-neon-blue"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Cari software..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glow pl-12"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="aspect-video skeleton" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 w-3/4 skeleton rounded" />
                    <div className="h-4 w-1/2 skeleton rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Code2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Tidak ada software ditemukan
              </h3>
              <p className="text-slate-400">
                Coba ubah filter atau kata kunci pencarian Anda
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
