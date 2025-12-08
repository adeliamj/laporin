/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import { RequireRole } from "@/components/RequireRole";
import Link from "next/link";
import { ArrowLeft, Send, AlertCircle, CheckCircle, Phone, Mail, FileText } from "lucide-react";

export default function UserLaporPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    nama_korban: "",
    kontak_korban: "",
    lokasi_korban: "",
    korban_terkait: "",
    jenis_kasus: "",
    custom_jenis_kasus: "",
    tanggal_kejadian: "",
    ringkasan: "",
  });

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleJenisChange(e: any) {
    const value = e.target.value;
    setForm({ ...form, jenis_kasus: value, custom_jenis_kasus: "" });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const finalJenisKasus =
      form.jenis_kasus === "lainnya" ? form.custom_jenis_kasus : form.jenis_kasus;

    if (!form.nama_korban || !finalJenisKasus) {
      setError("Nama korban dan jenis kasus wajib diisi");
      setSubmitting(false);
      return;
    }

    try {
      let korbanId: number | null = null;

      if (form.nama_korban) {
        const resKorban = await fetch("/api/korban", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nama: form.nama_korban,
            kontak: form.kontak_korban,
            alamat: form.lokasi_korban,
          }),
        });

        const dataKorban = await resKorban.json();
        if (!resKorban.ok || !dataKorban.korbanId) {
          setError(dataKorban.message || "Gagal menambahkan korban");
          setSubmitting(false);
          return;
        }
        korbanId = dataKorban.korbanId;
      }

      const resKasus = await fetch("/api/kasus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          korban_id: korbanId,
          jenis_kasus: finalJenisKasus,
          korban_terkait: form.korban_terkait || null,
          tanggal_kejadian: form.tanggal_kejadian || null,
          ringkasan: form.ringkasan || "",
          status_kasus: "open",
        }),
      });

      const dataKasus = await resKasus.json();
      if (!resKasus.ok || !dataKasus.kasusId) {
        setError(dataKasus.message || "Gagal menambahkan kasus");
        setSubmitting(false);
        return;
      }

      setSuccess("Laporan berhasil dikirim! Tim kami akan segera menindaklanjuti.");
      setForm({
        nama_korban: "",
        kontak_korban: "",
        lokasi_korban: "",
        korban_terkait: "",
        jenis_kasus: "",
        custom_jenis_kasus: "",
        tanggal_kejadian: "",
        ringkasan: "",
      });
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <RequireRole role="user">
      <div className="absolute inset-0 min-h-screen overflow-auto bg-gradient-to-br from-[#0a1a33] via-[#0f2242] to-[#0a1a33]">
        {/* Soft Glow Effects */}
        <div className="absolute top-[-120px] left-[-80px] w-[300px] h-[300px] bg-blue-600 opacity-25 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-indigo-500 opacity-25 blur-[150px] rounded-full"></div>

        <div className="relative z-10 max-w-4xl mx-auto p-6 py-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-white mb-6 font-medium transition-colors animate-fadeIn"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
              Form Laporan Kasus
            </h1>
            <p className="text-blue-200/80 text-lg">
              Lengkapi formulir di bawah ini untuk melaporkan kasus Anda
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="relative overflow-hidden rounded-xl bg-green-500/10 backdrop-blur-xl border border-green-500/30 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-300 font-medium">{success}</p>
                    <p className="text-xs text-green-400/80 mt-1">Anda akan dihubungi dalam 1x24 jam</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="relative overflow-hidden rounded-xl bg-red-500/10 backdrop-blur-xl border border-red-500/30 p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <div className="relative overflow-hidden rounded-2xl bg-[#0d1b36]/60 backdrop-blur-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              {/* Glossy highlight */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-white/10 to-transparent opacity-30 rounded-t-2xl"></div>
              </div>

              <div className="relative p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Data Korban Section */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-blue-500/30 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-bold">1</span>
                      </div>
                      Data Korban
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Nama Korban <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="nama_korban"
                          value={form.nama_korban}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Kontak <span className="text-red-400">*</span>
                        </label>
                        <input
                          name="kontak_korban"
                          value={form.kontak_korban}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                          placeholder="No HP / Email"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Lokasi / Alamat <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="lokasi_korban"
                          value={form.lokasi_korban}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all resize-none"
                          rows={3}
                          placeholder="Alamat lengkap"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Korban Terkait <span className="text-white/50 text-xs">(opsional)</span>
                        </label>
                        <input
                          name="korban_terkait"
                          value={form.korban_terkait}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                          placeholder="Nama korban lain terkait"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Jenis Kasus Section */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-purple-500/30 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-400 font-bold">2</span>
                      </div>
                      Jenis Kasus
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Kategori Kasus <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <select
                            name="jenis_kasus"
                            value={form.jenis_kasus}
                            onChange={handleJenisChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 appearance-none transition-all"
                            required
                          >
                            <option value="" className="bg-slate-800">-- Pilih Jenis Kasus --</option>
                            <optgroup label="🔐 Kasus Digital" className="bg-slate-800">
                              <option value="peretasan akun" className="bg-slate-800">Peretasan akun</option>
                              <option value="pencurian data" className="bg-slate-800">Pencurian data</option>
                              <option value="penipuan online" className="bg-slate-800">Penipuan online</option>
                              <option value="phishing" className="bg-slate-800">Phishing</option>
                              <option value="malware/ransomware" className="bg-slate-800">Malware / Ransomware</option>
                            </optgroup>
                            <optgroup label="⚖️ Kasus Kriminal" className="bg-slate-800">
                              <option value="pencurian" className="bg-slate-800">Pencurian</option>
                              <option value="penipuan" className="bg-slate-800">Penipuan</option>
                              <option value="penganiayaan" className="bg-slate-800">Penganiayaan</option>
                              <option value="perdagangan ilegal" className="bg-slate-800">Perdagangan ilegal</option>
                            </optgroup>
                            <optgroup label="📋 Kasus Lainnya" className="bg-slate-800">
                              <option value="pelecehan" className="bg-slate-800">Pelecehan</option>
                              <option value="tindak pidana lingkungan" className="bg-slate-800">Tindak pidana lingkungan</option>
                              <option value="lainnya" className="bg-slate-800">Lainnya</option>
                            </optgroup>
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {form.jenis_kasus === "lainnya" && (
                        <div>
                          <label className="block text-sm text-white/90 mb-2">
                            Sebutkan Jenis Kasus <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="custom_jenis_kasus"
                            value={form.custom_jenis_kasus}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                            placeholder="Tuliskan jenis kasus"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm text-white/90 mb-2">
                          Tanggal Kejadian
                        </label>
                        <input
                          type="date"
                          name="tanggal_kejadian"
                          value={form.tanggal_kejadian}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Detail Kejadian Section */}
                  <div>
                    <h2 className="text-xl font-bold text-white mb-5 pb-3 border-b border-green-500/30 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <span className="text-green-400 font-bold">3</span>
                      </div>
                      Detail Kejadian
                    </h2>
                    <div>
                      <label className="block text-sm text-white/90 mb-2">
                        Kronologi Kejadian <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        name="ringkasan"
                        value={form.ringkasan}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-blue-500/40 transition-all resize-none"
                        rows={8}
                        placeholder="Ceritakan kronologi kejadian secara detail..."
                        required
                      />
                      <p className="mt-2 text-xs text-blue-200/60">
                        Semakin detail informasi yang Anda berikan, semakin mudah kami membantu
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full px-8 py-4 rounded-xl font-semibold tracking-wide bg-gradient-to-r from-green-600 to-emerald-600 border border-white/10 shadow-[0_6px_26px_rgba(16,185,129,0.45)] hover:scale-[1.02] hover:shadow-[0_7px_30px_rgba(16,185,129,0.55)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 text-white"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Mengirim Laporan...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Kirim Laporan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <div className="relative overflow-hidden rounded-xl bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Butuh Bantuan?</h3>
                  <p className="text-sm text-blue-200/80 mb-3">
                    Jika mengalami kesulitan, hubungi hotline kami
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <a href="tel:08123456789" className="text-blue-300 hover:text-white font-medium transition-colors flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      0812-3456-789
                    </a>
                    <a href="mailto:support@forensik.id" className="text-blue-300 hover:text-white font-medium transition-colors flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      support@forensik.id
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.7s ease-out forwards;
          }
        `}</style>
      </div>
    </RequireRole>
  );
}