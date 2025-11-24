import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

// GET: ambil semua korban
export async function GET() {
  try {
    const [rows]: any = await pool.query(`SELECT * FROM korban ORDER BY id DESC`);
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err });
  }
}

// POST: tambah korban baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, kontak, alamat } = body;

    if (!nama) {
      return NextResponse.json(
        { message: "Nama korban wajib diisi" },
        { status: 400 }
      );
    }

    const [result]: any = await pool.query(
      `INSERT INTO korban (nama, kontak, alamat) VALUES (?, ?, ?)`,
      [nama, kontak || null, alamat || null]
    );

    return NextResponse.json(
      { message: "Korban berhasil ditambahkan", korbanId: result.insertId },
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