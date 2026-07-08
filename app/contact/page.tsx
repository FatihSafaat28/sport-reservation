"use client";

import React, { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "pertanyaan",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Mohon lengkapi semua kolom formulir.");
      return;
    }

    setIsSubmitting(true);
    // Simulate sending message
    setTimeout(() => {
      toast.success("Umpan berhasil diterima! Tim kami akan segera merespons.");
      setFormData({
        name: "",
        email: "",
        subject: "pertanyaan",
        message: "",
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="max-w-[1440px] mx-auto px-8 sm:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Hubungi Kami
          </h1>
          <p className="mt-3 text-gray-500 text-lg max-w-lg mx-auto">
            Ada umpan lambung, kritik tajam, atau tawaran kolaborasi menarik? Oper pesanmu langsung ke tim Mabarin.
          </p>
        </div>

        {/* Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8">
          {/* Left Column: Creative Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Hubungi Langsung</h3>
              <div className="space-y-6 text-sm text-gray-600">
                <div className="flex gap-4">
                  <div className="text-blue-600 mt-1 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Markas Besar</h4>
                    <p className="mt-1 leading-relaxed text-gray-500">
                      Jl. Arena Kemenangan No. 45, Kota Sporty, Indonesia (Tempat di mana kopi diseduh sehangat sapaan pagi).
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 mt-1 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Panggil Wasit (Dukungan)</h4>
                    <p className="mt-1 font-bold text-gray-800 text-base">+62 812-3456-7890</p>
                    <p className="text-xs text-gray-500">Tersedia kapan pun Anda butuh peluit bantuan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-blue-600 mt-1 shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Kotak Pos Resmi</h4>
                    <p className="mt-1 font-bold text-gray-800 text-base">oper@sportreservation.com</p>
                    <p className="text-xs text-gray-500">Untuk proposal kerjasama, partnership, atau sekadar kirim meme olahraga.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 text-sm text-gray-600 leading-relaxed shadow-sm">
              <span className="font-bold text-gray-900 block mb-1">⏱️ Durasi Respons:</span>
              Wasit kami biasanya merespons semua pesan masuk dalam waktu **maksimal 2 jam** pada jam kerja (Senin - Minggu, 08:00 - 22:00 WIB). Keringat Anda berharga, begitu pula waktu Anda!
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Formulir Oper Umpan</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Masukkan nama bermainmu"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@emailkamu.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 text-sm bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subjek / Topik</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 text-sm bg-white cursor-pointer"
                  >
                    <option value="lapor_bug">🐛 Lapor Bug (Aplikasi terpeleset)</option>
                    <option value="kolaborasi">🤝 Tawaran Kolaborasi (Main bareng)</option>
                    <option value="pertanyaan">⚽ Pertanyaan Event / Booking</option>
                    <option value="curhat">💬 Kritik & Saran Wasit (Curhat bebas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Pesan Umpan</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tulis kritik, pertanyaan, atau usulanmu secara detail di sini..."
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 text-sm bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Mengirim Umpan..."
                  ) : (
                    <>
                      Kirim Pesan
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
