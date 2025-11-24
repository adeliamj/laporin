import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET: ambil semua kasus beserta nama korban
export async function GET() {
  try {
    const [rows]: any = await pool.query(
      `SELECT k.*, kb.nama AS nama_korban
       FROM kasus k
       LEFT JOIN korban kb ON k.korban_id = kb.id
       ORDER BY k.id DESC`
    );
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}

// POST: tambah kasus baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { korban_id, korban_terkait, jenis_kasus, tanggal_kejadian, ringkasan } = body;

    if (!jenis_kasus || !ringkasan) {
      return NextResponse.json(
        { message: "Field wajib diisi" },
        { status: 400 }
      );
    }

    // korban_id boleh null
    const [result]: any = await pool.query(
      `INSERT INTO kasus (korban_id, korban_terkait, jenis_kasus, tanggal_kejadian, ringkasan, status_kasus)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [korban_id || null, korban_terkait || null, jenis_kasus, tanggal_kejadian || null, ringkasan, "open"]
    );

    return NextResponse.json(
      { message: "Kasus berhasil ditambahkan", kasusId: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server", error: err },
      { status: 500 }
    );
  }
}
