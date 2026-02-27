import { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan GAMINGGLOW",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">
            Syarat & <span className="text-neon-blue">Ketentuan</span>
          </h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 text-lg mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">1. Penerimaan Syarat</h2>
              <p className="text-slate-400">
                Dengan mengakses dan menggunakan website GAMINGGLOW, Anda menyetujui untuk terikat 
                oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari 
                syarat ini, Anda tidak diperbolehkan menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">2. Penggunaan Layanan</h2>
              <p className="text-slate-400 mb-4">
                GAMINGGLOW menyediakan platform download untuk game dan software PC yang legal. 
                Dengan menggunakan layanan kami, Anda setuju untuk:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Menggunakan layanan hanya untuk tujuan yang legal dan sah</li>
                <li>Tidak menyalahgunakan atau mencoba merusak sistem kami</li>
                <li>Tidak menggunakan bot atau script otomatis untuk mengakses layanan</li>
                <li>Mematuhi batasan rate limiting yang diterapkan</li>
                <li>Tidak mendistribusikan ulang file yang diunduh tanpa izin</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">3. Hak Kekayaan Intelektual</h2>
              <p className="text-slate-400 mb-4">
                Semua konten yang tersedia di GAMINGGLOW adalah milik dari pemiliknya masing-masing. 
                Kami hanya menyediakan platform distribusi untuk:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Software open source dengan lisensi yang sesuai</li>
                <li>Game dan software freeware</li>
                <li>Konten dengan izin distribusi resmi dari pemilik</li>
                <li>Software trial dengan persetujuan developer</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">4. Kebijakan Upload</h2>
              <p className="text-slate-400 mb-4">
                Bagi uploader yang ingin mendistribusikan konten melalui GAMINGGLOW:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Hanya upload konten yang Anda miliki hak untuk distribusikan</li>
                <li>Pastikan file bebas dari malware dan virus</li>
                <li>Sertakan informasi lengkap tentang produk</li>
                <li>Tanggung jawab penuh atas konten yang diupload</li>
                <li>Setuju untuk mematuhi proses moderasi kami</li>
              </ul>
              <p className="text-slate-400 mt-4">
                Pelanggaran akan mengakibatkan penghapusan konten dan potensi pemblokiran akun.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">5. Disclaimer</h2>
              <p className="text-slate-400">
                GAMINGGLOW menyediakan layanan &quot;apa adanya&quot; tanpa jaminan apa pun. Kami tidak 
                bertanggung jawab atas kerusakan yang mungkin terjadi dari penggunaan software 
                yang diunduh. Selalu lakukan backup data penting Anda sebelum menginstall software baru.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">6. Perubahan Syarat</h2>
              <p className="text-slate-400">
                Kami berhak mengubah syarat dan ketentuan ini kapan saja. Perubahan akan efektif 
                segera setelah diposting di website. Penggunaan berkelanjutan atas layanan kami 
                setelah perubahan merupakan penerimaan atas syarat yang diperbarui.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">7. Kontak</h2>
              <p className="text-slate-400">
                Untuk pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:{" "}
                <a href="mailto:legal@gamingglow.local" className="text-neon-blue hover:underline">
                  legal@gamingglow.local
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
