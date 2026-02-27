import { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Kebijakan privasi GAMINGGLOW",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-navy-900">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">
            Kebijakan <span className="text-neon-magenta">Privasi</span>
          </h1>

          <div className="prose prose-invert prose-slate max-w-none">
            <p className="text-slate-400 text-lg mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Pendahuluan</h2>
              <p className="text-slate-400">
                GAMINGGLOW menghargai privasi Anda. Kebijakan privasi ini menjelaskan bagaimana 
                kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat 
                menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Informasi yang Kami Kumpulkan</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">Informasi Otomatis</h3>
              <p className="text-slate-400 mb-4">
                Saat Anda mengunjungi website kami, kami secara otomatis mengumpulkan:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Alamat IP (dihash untuk anonimitas)</li>
                <li>Tipe browser dan sistem operasi</li>
                <li>Halaman yang dikunjungi dan waktu akses</li>
                <li>Statistik download (produk, waktu, ukuran file)</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3 mt-6">Informasi yang Anda Berikan</h3>
              <p className="text-slate-400 mb-4">
                Informasi yang Anda berikan secara sukarela:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Alamat email (untuk notifikasi release, opsional)</li>
                <li>Informasi kontak saat melaporkan masalah</li>
                <li>Data DMCA claim saat melaporkan pelanggaran</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Penggunaan Informasi</h2>
              <p className="text-slate-400 mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Menyediakan dan meningkatkan layanan download</li>
                <li>Mencegah penyalahgunaan dan rate limiting</li>
                <li>Menganalisis penggunaan untuk perbaikan layanan</li>
                <li>Mengirim notifikasi release (jika diopt-in)</li>
                <li>Menanggapi pertanyaan dan laporan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Penyimpanan dan Keamanan</h2>
              <p className="text-slate-400 mb-4">
                Kami mengambil langkah-langkah untuk melindungi data Anda:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Enkripsi HTTPS untuk semua transmisi data</li>
                <li>Hashing alamat IP untuk anonimitas</li>
                <li>Akses database terbatas untuk admin yang berwenang</li>
                <li>Audit log untuk semua akses data sensitif</li>
                <li>Retensi data terbatas sesuai kebutuhan operasional</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Cookie dan Teknologi Serupa</h2>
              <p className="text-slate-400">
                Kami menggunakan cookie dan teknologi serupa untuk:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Mengingat preferensi pengguna</li>
                <li>Menganalisis traffic dan penggunaan website</li>
                <li>Mencegah aktivitas fraudulent</li>
              </ul>
              <p className="text-slate-400 mt-4">
                Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa 
                fitur mungkin tidak berfungsi dengan baik.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Pihak Ketiga</h2>
              <p className="text-slate-400 mb-4">
                Kami tidak menjual atau menyewakan data pribadi Anda. Kami dapat berbagi 
                data dengan:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Penyedia layanan hosting dan CDN</li>
                <li>Layanan analitik (tanpa data pribadi yang dapat diidentifikasi)</li>
                <li>Otoritas hukum jika diwajibkan oleh hukum</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Hak Anda</h2>
              <p className="text-slate-400 mb-4">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-2 ml-4">
                <li>Mengakses data pribadi Anda yang kami simpan</li>
                <li>Meminta koreksi data yang tidak akurat</li>
                <li>Meminta penghapusan data (dengan batasan tertentu)</li>
                <li>Menolak penggunaan data untuk marketing</li>
                <li>Mengajukan keluhan ke otoritas perlindungan data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Anak di Bawah Umur</h2>
              <p className="text-slate-400">
                Layanan kami tidak ditujukan untuk anak di bawah 13 tahun. Kami tidak 
                dengan sengaja mengumpulkan informasi dari anak di bawah 13 tahun. 
                Jika Anda mengetahui bahwa anak Anda telah memberikan informasi pribadi, 
                silakan hubungi kami untuk penghapusan.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Perubahan Kebijakan</h2>
              <p className="text-slate-400">
                Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                Perubahan akan diposting di halaman ini dengan tanggal revisi yang diperbarui. 
                Penggunaan berkelanjutan atas layanan kami setelah perubahan merupakan 
                penerimaan atas kebijakan yang diperbarui.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Kontak</h2>
              <p className="text-slate-400">
                Untuk pertanyaan tentang kebijakan privasi ini atau permintaan terkait data Anda, 
                silakan hubungi kami di:{" "}
                <a href="mailto:privacy@gamingglow.local" className="text-neon-blue hover:underline">
                  privacy@gamingglow.local
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
