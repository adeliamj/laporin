// app/api/kasus/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const id = params.id;
  const body = await req.json();
  const { status_kasus } = body;

  if (!status_kasus) {
    return NextResponse.json({ message: "Status kasus wajib diisi" }, { status: 400 });
  }

  // Ambil data kasus yang sudah ada
  const [rows]: any = await pool.query("SELECT * FROM kasus WHERE id = ?", [id]);
  if (!rows || rows.length === 0) {
    return NextResponse.json({ message: "Kasus tidak ditemukan" }, { status: 404 });
  }

  // Update hanya status_kasus
  await pool.query(
    `UPDATE kasus
     SET status_kasus = ?
     WHERE id = ?`,
    [status_kasus, id]
  );

  return NextResponse.json({ message: "Status kasus berhasil diupdate" });
}

export async function DELETE(req: Request, { params }: Params) {
  const id = params.id;
  await pool.query("DELETE FROM kasus WHERE id = ?", [id]);
  return NextResponse.json({ message: "Kasus deleted" });
}
