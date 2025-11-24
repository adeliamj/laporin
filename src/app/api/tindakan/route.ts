// app/api/tindakan/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function GET() {
  // Ambil tindakan + info kasus
  const [rows]: any = await pool.query(
    `SELECT t.*, k.jenis_kasus
     FROM tindakan_forensik t
     JOIN kasus k ON t.kasus_id = k.id
     ORDER BY t.id DESC`
  );
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { kasus_id, waktu_pelaksanaan, pec } = body;

  await pool.query(
    `INSERT INTO tindakan_forensik
      (kasus_id, waktu_pelaksanaan, pec)
     VALUES (?, ?, ?)`,
    [
      kasus_id,
      waktu_pelaksanaan || null, // datetime
      pec || null,
    ]
  );

  return NextResponse.json(
    { message: "Tindakan forensik created" },
    { status: 201 }
  );
}
