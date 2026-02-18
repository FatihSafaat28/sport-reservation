import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/navbar";
import UpcomingEvent from "./upcoming-event";
import Footer from "./components/footer";

export default function Homepage() {
  return (
    <>
      <main>
        <header
          id="hero"
          className="relative flex items-center px-8 sm:px-12 lg:px-20 py-6 min-h-[calc(100vh-4rem)] bg-cover bg-center bg-no-repeat overflow-hidden group"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=2607&auto=format&fit=crop')",
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60 z-0"></div>

          <div className="flex flex-col gap-6 w-full justify-center relative z-10 max-w-[1440px] mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Bingung Olahraga? <br />{" "}
              <span className="text-blue-400">Mabarin aja!</span>
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed">
              Cari eventnya, bayarnya mudah, langsung mabar tanpa ribet!
              <br />
              Yuk langsung join di Mabarin!
            </p>
            <div className="w-fit">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-full transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1">
                Start Exploring
              </button>
            </div>
          </div>
        </header>
        <section id="upcoming-event" className="px-8 sm:px-12 lg:px-0 py-6 max-w-[1440px] mx-auto">
          <UpcomingEvent />
        </section>
        <section id="how-it-works" className="px-8 sm:px-12 lg:px-0 py-6 max-w-[1440px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Cara Mabarnya Gimana?</h2>
            <p className="text-gray-500 mt-2 text-lg">
              Tiga langkah mudah untuk mulai mabar bersama Mabarin!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1: Find Activity */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Find Activity
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Cari kategori dan aktivitas olahraga dan lokasi yang terdekat
                sesuai yang kamu inginkan.
              </p>
            </div>

            {/* Step 2: Book & Pay */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Book & Pay
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Lakukan booking aktivitas dan pembayaran dengan mudah dan aman.
              </p>
            </div>

            {/* Step 3: Join & Play */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-200 transition-colors duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Join & Play
              </h3>
              <p className="text-gray-500 leading-relaxed max-w-xs">
                Datang ke lokasi, tunjukkan tiket, dan nikmati keseruan mabar
                bersama teman-teman baru!
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
