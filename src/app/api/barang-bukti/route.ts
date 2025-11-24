import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  const [rows]: any = await pool.query(
    `SELECT b.*, k.jenis_kasus
     FROM barang_bukti b
     JOIN kasus k ON b.kasus_id = k.id
     ORDER BY b.id DESC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } = body;

  await pool.query(
    `INSERT INTO barang_bukti
      (kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan)
     VALUES (?, ?, ?, ?)`,
    [
      kasus_id,
      jenis_bukti || null,
      lokasi_penyimpanan || null,
      waktu_penyimpanan || null,
    ]
  );

  return NextResponse.json({ message: "Barang bukti created" }, { status: 201 });
}

