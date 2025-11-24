"use client";

import { FormEvent, useState } from "react";
import { RequireRole } from "@/app/components/RequireRole";

export default function UserLaporPage() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

    const finalJenisKasus =
      form.jenis_kasus === "lainnya" ? form.custom_jenis_kasus : form.jenis_kasus;

    if (!form.nama_korban || !finalJenisKasus) {
      setError("Nama korban dan jenis kasus wajib diisi");
      return;
    }

    try {
      let korbanId: number | null = null;

      // 1. Jika ada nama korban, insert ke tabel korban
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
          return;
        }
        korbanId = dataKorban.korbanId;
      }

      // 2. Insert kasus
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
        return;
      }

      setSuccess("Laporan berhasil dikirim!");
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
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan server");
    }
  }

  return (
    <RequireRole role="user">
      <div className="p-4 max-w-xl mx-auto bg-white border rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Form Laporan Kasus</h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Korban */}
          <div>
            <label className="block text-sm mb-1">Nama Korban</label>
            <input
              name="nama_korban"
              value={form.nama_korban}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="Masukkan nama korban"
              required
            />
          </div>

          {/* Kontak Korban */}
          <div>
            <label className="block text-sm mb-1">Kontak Korban</label>
            <input
              name="kontak_korban"
              value={form.kontak_korban}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="No HP / email (opsional)"
            />
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-sm mb-1">Lokasi / Alamat Korban</label>
            <input
              name="lokasi_korban"
              value={form.lokasi_korban}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="Alamat/lokasi kejadian"
            />
          </div>

          {/* Korban Terkait */}
          <div>
            <label className="block text-sm mb-1">Korban Terkait (opsional)</label>
            <input
              name="korban_terkait"
              value={form.korban_terkait}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              placeholder="Nama korban lain terkait kasus ini"
            />
          </div>

          {/* Jenis Kasus */}
          <div>
            <label className="block text-sm mb-1">Jenis Kasus</label>
            <select
              name="jenis_kasus"
              value={form.jenis_kasus}
              onChange={handleJenisChange}
              className="border px-2 py-1 rounded w-full"
              required
            >
              <option value="">-- Pilih Jenis Kasus --</option>

              <optgroup label="Kasus Digital">
                <option value="peretasan akun">Peretasan akun</option>
                <option value="pencurian data">Pencurian data</option>
                <option value="penipuan online">Penipuan online</option>
                <option value="phishing">Phishing</option>
                <option value="malware/ransomware">Malware / Ransomware</option>
              </optgroup>

              <optgroup label="Kasus Kriminal">
                <option value="pencurian">Pencurian</option>
                <option value="penipuan">Penipuan</option>
                <option value="penganiayaan">Penganiayaan</option>
                <option value="perdagangan ilegal">Perdagangan ilegal</option>
              </optgroup>

              <optgroup label="Kasus Lainnya">
                <option value="pelecehan">Pelecehan</option>
                <option value="tindak pidana lingkungan">Tindak pidana lingkungan</option>
                <option value="lainnya">Lainnya</option>
              </optgroup>
            </select>

            {/* Custom jenis kasus muncul kalau pilih "Lainnya" */}
            {form.jenis_kasus === "lainnya" && (
              <input
                type="text"
                name="custom_jenis_kasus"
                value={form.custom_jenis_kasus}
                onChange={handleChange}
                className="border px-2 py-1 rounded w-full mt-2"
                placeholder="Tuliskan jenis kasus"
                required
              />
            )}
          </div>

          {/* Tanggal Kejadian */}
          <div>
            <label className="block text-sm mb-1">Tanggal Kejadian</label>
            <input
              type="date"
              name="tanggal_kejadian"
              value={form.tanggal_kejadian}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            />
          </div>

          {/* Ringkasan */}
          <div>
            <label className="block text-sm mb-1">Ringkasan Kejadian</label>
            <textarea
              name="ringkasan"
              value={form.ringkasan}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
              rows={4}
              placeholder="Ceritakan singkat kronologi kejadian..."
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            className="px-4 py-2 rounded bg-black text-white"
          >
            Kirim Laporan
          </button>
        </form>
      </div>
    </RequireRole>
  );
}
