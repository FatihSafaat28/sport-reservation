import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Tentang Kami",
  description: "Kenali lebih dekat Mabarin, platform yang menghubungkan ribuan pecinta olahraga untuk berkumpul, bermain, dan membangun komunitas.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <header
        id="about-hero"
        className="relative flex items-center px-8 sm:px-12 lg:px-20 py-16 min-h-[calc(100vh-4rem)] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2607&auto=format&fit=crop')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="flex flex-col gap-4 w-full justify-center relative z-10 max-w-[1440px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mt-2">
            Lebih Dari Sekadar Booking. <br />
            <span className="text-blue-400">Mabarin aja!</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mt-2">
            Kami tahu rasanya grup WhatsApp yang berakhir menjadi wacana tanpa ujung.
            Mabarin hadir untuk menjembatani keringat, tawa, dan sportivitas Anda dengan alur yang mudah dan aman.
          </p>
        </div>
      </header>

      {/* Values Section */}
      <section id="values" className="px-8 sm:px-12 lg:px-20 py-16 max-w-[1440px] mx-auto bg-white">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Pilar Nilai Utama Kami</h2>
          <p className="text-gray-500 mt-2 text-lg">
            Nilai dasar yang kami bawa untuk mendukung setiap aktivitas olahraga Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Value 1 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kecepatan Refleks</h3>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              Booking lapangan dan gabung event secepat refleks kiper kelas dunia. Temukan mabar terdekat tanpa drama slot penuh.
            </p>
          </div>

          {/* Value 2 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Semangat Komunitas</h3>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              Buka ruang mabar bagi siapa saja. Dari amatir yang ingin cari keringat baru, hingga veteran komunitas olahraga yang siap tanding.
            </p>
          </div>

          {/* Value 3 */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparansi Mutlak</h3>
            <p className="text-gray-500 leading-relaxed max-w-xs">
              Tanpa biaya tersembunyi. Alur pembayaran transparan dan terverifikasi otomatis, langsung terhubung dengan Host pilihan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="bg-gray-50 py-16">
        <div className="px-8 sm:px-12 lg:px-20 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {/* Story Text */}
            <div className="flex flex-col gap-6 md:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900">Cerita Di Balik Arena</h2>
              <div className="text-gray-600 space-y-4 leading-relaxed text-base">
                <p>
                  Dimulai dari satu keresahan sederhana di akhir pekan: mencari kawan tanding sepak bola dan lapangan kosong yang ramah di kantong.
                  Grup chat penuh dengan wacana "ikut main dong", namun minim realisasi karena koordinasi yang berantakan.
                </p>
                <p>
                  Mabarin didirikan untuk mengubah hal itu. Kami percaya bahwa olahraga tidak boleh dirumitkan oleh administrasi.
                  Dengan menyediakan ruang reservasi instan yang dikelola oleh Host tepercaya di berbagai daerah, kami mempermudah
                  langkah Anda dari rebahan di kasur menuju jabat tangan hangat di tengah lapangan hijau.
                </p>
                <p>
                  Hingga hari ini, kami telah menyatukan ribuan pemain lintas cabang olahraga—mulai dari Futsal, Badminton, Basket, hingga Mini Soccer.
                  Satu arena, ribuan keringat, dan persahabatan baru yang tercipta di setiap peluit akhir pertandingan.
                </p>
              </div>
            </div>

            {/* Story Image */}
            <div className="md:w-1/2 relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=1200&auto=format&fit=crop"
                alt="Sports team joining hands before starting the match"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section id="cta" className="px-8 sm:px-12 lg:px-20 py-16 max-w-[1440px] mx-auto text-center">
        <div className="bg-gray-900 rounded-3xl p-10 shadow-xl text-white relative overflow-hidden group">
          <div className="relative z-10 flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold mb-2">Siap untuk Berkeringat Hari Ini?</h2>
            <p className="text-gray-400 text-base mb-6 max-w-md">
              Temukan aktivitas mabar terdekat di kotamu dan langsung kunci slot bermainmu sekarang.
            </p>
            <Link
              href="/explore"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1"
            >
              Mulai Cari Event
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
