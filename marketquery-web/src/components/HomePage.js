import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const [copiedCode, setCopiedCode] = useState(false);

  const codeExample = `// 1. Setup Request ke MarketQuery API
const url = 'http://localhost:3009/api/products';
const apiKey = 'your-api-key-here';

// 2. Ambil Data dengan Authentikasi
async function getProducts() {
  const response = await fetch(url, {
    headers: {
      'Authorization': \`Bearer \${apiKey}\`
    }
  });
  const data = await response.json();
  console.log("📦 Products:", data);
}

getProducts();`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeExample);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Mudah Diintegrasikan",
      description: "Dokumentasi yang jelas dan format data JSON yang standar, bikin developer pemula pun bisa langsung pakai."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Akses Aman & Terkontrol",
      description: "Setiap request dilindungi dengan API Key unik. Kamu bisa memantau penggunaan data lewat dashboard."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
      title: "Data Produk Terstruktur",
      description: "Tersedia ribuan data produk marketplace yang sudah rapi, lengkap dengan kategori, harga, dan stok terkini."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 scroll-smooth">
      <Navbar />
      <div id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Integrasi Data{' '}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text">
                E-Commerce
              </span>
              <br />
              ke Aplikasimu.
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              RESTful API paling komprehensif untuk data produk marketplace Indonesia. 
              Didesain untuk Developer yang butuh kecepatan dan keandalan.
            </p>

            <motion.button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-pink-500/50 transition-all flex items-center gap-2"
            >
              Mulai Sekarang
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="bg-slate-900/80 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-gray-400 text-sm font-mono">example.js</span>
              </div>
              
              <div className="p-6 relative">
                <pre className="text-sm text-gray-300 font-mono overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
                
                <button
                  onClick={copyCode}
                  className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  {copiedCode ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-pink-500 uppercase tracking-wider mb-4">
              KENAPA MARKETQUERY API?
            </h2>
            <h3 className="text-4xl font-bold text-white mb-4">
              Solusi Praktis Backend
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Gak perlu repot bikin database dari nol. Fokus saja kembangkan tampilan aplikasimu, 
              biar kami yang sediakan datanya.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all"
              >
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div id="docs" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-sm font-bold text-pink-500 uppercase tracking-wider mb-4">
              DOKUMENTASI
            </h2>
            <h3 className="text-4xl font-bold text-white mb-4">
              Mulai dalam Hitungan Menit
            </h3>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Dokumentasi lengkap dengan contoh kode siap pakai. Dari pemula hingga advanced developer.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-xl font-bold text-white">Quick Start Guide</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Panduan cepat untuk memulai integrasi API dalam 5 menit. Lengkap dengan contoh request dan response.
              </p>
              <button className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-2">
                Baca Docs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h4 className="text-xl font-bold text-white">API Reference</h4>
              </div>
              <p className="text-gray-400 mb-4">
                Dokumentasi lengkap semua endpoint, parameter, dan response format. Dengan contoh implementasi.
              </p>
              <button className="text-pink-400 hover:text-pink-300 font-semibold flex items-center gap-2">
                Lihat Reference
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-sm font-bold text-pink-500 uppercase tracking-wider mb-4">
                TENTANG KAMI
              </h2>
              <h3 className="text-4xl font-bold text-white mb-6">
                Membangun Infrastruktur Data E-Commerce Indonesia
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                MarketQuery API lahir dari kebutuhan developer Indonesia yang butuh akses mudah ke data 
                produk marketplace. Kami percaya bahwa data yang terstruktur dan mudah diakses adalah 
                kunci untuk membangun aplikasi yang powerful.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Reliable & Fast</h4>
                    <p className="text-gray-400 text-sm">Uptime 99.9% dengan response time di bawah 200ms</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Developer Friendly</h4>
                    <p className="text-gray-400 text-sm">Dokumentasi lengkap dan support community yang aktif</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">1000+</div>
                    <div className="text-gray-400 text-sm">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">50+</div>
                    <div className="text-gray-400 text-sm">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                    <div className="text-gray-400 text-sm">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">24/7</div>
                    <div className="text-gray-400 text-sm">Support</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900/80 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">MarketQuery API</span>
            </div>
            
            <div className="text-center md:text-left">
              <p className="text-gray-400 mb-2">
                Menghubungkan kekayaan data marketplace Indonesia dengan teknologi masa depan. 
                Platform API terpercaya untuk developer.
              </p>
              <p className="text-gray-500 text-sm">
                © 2026 MarketQuery API
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;