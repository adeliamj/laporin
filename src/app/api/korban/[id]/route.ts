// app/api/korban/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

type Params = { params: { id: string } };

// UPDATE korban berdasarkan custom_id
export async function PUT(req: Request, { params }: Params) {
  const customId = params.id; // misal P001
  const body = await req.json();
  const { nama, kontak, alamat } = body;

  // Ambil id integer korban
  const [rows]: any = await pool.query(
    "SELECT id FROM korban WHERE custom_id = ?",
    [customId]
  );
  if (rows.length === 0) {
    return NextResponse.json({ message: "Korban tidak ditemukan" }, { status: 404 });
  }
  const id_int = rows[0].id;

  await pool.query(
    "UPDATE korban SET nama = ?, kontak = ?, alamat = ? WHERE id = ?",
    [nama || null, kontak || null, alamat || null, id_int]
  );

  return NextResponse.json({ message: "Korban updated" });
}

// DELETE korban berdasarkan custom_id
export async function DELETE(req: Request, { params }: Params) {
  const customId = params.id;

  // Ambil id integer korban
  const [rows]: any = await pool.query(
    "SELECT id FROM korban WHERE custom_id = ?",
    [customId]
  );
  if (rows.length === 0) {
    return NextResponse.json({ message: "Korban tidak ditemukan" }, { status: 404 });
  }
  const id_int = rows[0].id;

  await pool.query("DELETE FROM korban WHERE id = ?", [id_int]);

  return NextResponse.json({ message: "Korban deleted" });
}
