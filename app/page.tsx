import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/navbar";
import UpcomingEvent from "./components/upcoming-event";

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
      <footer className="bg-gray-900 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-12 px-8 sm:px-12 lg:px-0 lg:max-w-[1440px] mx-auto">
            <div className="text-2xl font-bold">Mabarin!</div>

            <div className="text-sm text-gray-400 text-center md:text-left order-3 md:order-2">
              © 2026 Fatihdev. All Rights Reserved
            </div>

            <div className="flex items-center gap-6 order-2 md:order-3">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.488 2h.105zm-1.164 3.88a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
    </>
  );
}
