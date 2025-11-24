// app/api/barang-bukti/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

type Params = { params: { id: string } };

// UPDATE barang bukti berdasarkan id
export async function PUT(req: Request, { params }: Params) {
  const id_int = Number(params.id);
  const body = await req.json();
  const { kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } = body;

  // Validasi kasus_id wajib
  if (!kasus_id) {
    return NextResponse.json({ message: "Kasus harus dipilih" }, { status: 400 });
  }

  // Cek barang bukti ada
  const [rows]: any = await pool.query("SELECT id FROM barang_bukti WHERE id = ?", [id_int]);
  if (rows.length === 0) {
    return NextResponse.json({ message: "Barang bukti tidak ditemukan" }, { status: 404 });
  }

  await pool.query(
    `UPDATE barang_bukti
     SET kasus_id = ?, jenis_bukti = ?, lokasi_penyimpanan = ?, waktu_penyimpanan = ?
     WHERE id = ?`,
    [kasus_id, jenis_bukti || null, lokasi_penyimpanan || null, waktu_penyimpanan || null, id_int]
  );

  return NextResponse.json({ message: "Barang bukti updated" });
}

// DELETE barang bukti berdasarkan id
export async function DELETE(req: Request, { params }: Params) {
  const id_int = Number(params.id);

  const [rows]: any = await pool.query("SELECT id FROM barang_bukti WHERE id = ?", [id_int]);
  if (rows.length === 0) {
    return NextResponse.json({ message: "Barang bukti tidak ditemukan" }, { status: 404 });
  }

  await pool.query("DELETE FROM barang_bukti WHERE id = ?", [id_int]);

  return NextResponse.json({ message: "Barang bukti deleted" });
}
