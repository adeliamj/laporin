"use client";

import { FormEvent, useState } from "react";
import { RequireRole } from "@/app/components/RequireRole";
import Link from "next/link";

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
      
      // Scroll to top to show success message
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Dashboard
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            </div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Form Laporan Kasus
            </h1>
            <p className="text-slate-600">
              Lengkapi formulir di bawah ini untuk melaporkan kasus Anda
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-green-700 font-medium">{success}</p>
                  <p className="text-xs text-green-600 mt-1">Anda akan dihubungi dalam 1x24 jam</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Korban Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-blue-100">
                  Data Korban
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nama Korban <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="nama_korban"
                      value={form.nama_korban}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Masukkan nama lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kontak <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="kontak_korban"
                      value={form.kontak_korban}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="No HP / Email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lokasi / Alamat <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="lokasi_korban"
                      value={form.lokasi_korban}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                      rows={3}
                      placeholder="Alamat lengkap"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Korban Terkait <span className="text-slate-400 text-xs">(opsional)</span>
                    </label>
                    <input
                      name="korban_terkait"
                      value={form.korban_terkait}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Nama korban lain terkait"
                    />
                  </div>
                </div>
              </div>

              {/* Jenis Kasus Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-purple-100">
                  Jenis Kasus
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Kategori Kasus <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="jenis_kasus"
                      value={form.jenis_kasus}
                      onChange={handleJenisChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">-- Pilih Jenis Kasus --</option>
                      <optgroup label="🔐 Kasus Digital">
                        <option value="peretasan akun">Peretasan akun</option>
                        <option value="pencurian data">Pencurian data</option>
                        <option value="penipuan online">Penipuan online</option>
                        <option value="phishing">Phishing</option>
                        <option value="malware/ransomware">Malware / Ransomware</option>
                      </optgroup>
                      <optgroup label="⚖️ Kasus Kriminal">
                        <option value="pencurian">Pencurian</option>
                        <option value="penipuan">Penipuan</option>
                        <option value="penganiayaan">Penganiayaan</option>
                        <option value="perdagangan ilegal">Perdagangan ilegal</option>
                      </optgroup>
                      <optgroup label="📋 Kasus Lainnya">
                        <option value="pelecehan">Pelecehan</option>
                        <option value="tindak pidana lingkungan">Tindak pidana lingkungan</option>
                        <option value="lainnya">Lainnya</option>
                      </optgroup>
                    </select>
                  </div>

                  {form.jenis_kasus === "lainnya" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Sebutkan Jenis Kasus <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="custom_jenis_kasus"
                        value={form.custom_jenis_kasus}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Tuliskan jenis kasus"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tanggal Kejadian
                    </label>
                    <input
                      type="date"
                      name="tanggal_kejadian"
                      value={form.tanggal_kejadian}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Kejadian Section */}
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-green-100">
                  Detail Kejadian
                </h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kronologi Kejadian <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="ringkasan"
                    value={form.ringkasan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={8}
                    placeholder="Ceritakan kronologi kejadian secara detail..."
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Semakin detail informasi yang Anda berikan, semakin mudah kami membantu
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-blue-100 from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Kirim Laporan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-1">Butuh Bantuan?</h3>
                <p className="text-sm text-slate-600 mb-2">
                  Jika mengalami kesulitan, hubungi hotline kami
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <a href="tel:08123456789" className="text-blue-600 hover:text-blue-700 font-medium">
                    📞 0812-3456-789
                  </a>
                  <a href="mailto:support@forensik.id" className="text-blue-600 hover:text-blue-700 font-medium">
                    ✉️ support@forensik.id
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}