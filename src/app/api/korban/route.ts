import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";
import prisma from "@/app/lib/db";

// GET: ambil semua korban
export async function GET() {
  try {
    // const [rows]: any = await pool.query(`SELECT * FROM korban ORDER BY id DESC`);

    const data = await prisma.korban.findMany({
      include: {
        kasus: {
          select: {
            id: true,
            jenis_kasus: true,
            status_kasus: true,
            tanggal_kejadian: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch korban" },
      { status: 500 }
    );
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

    // const [result]: any = await pool.query(
    //   `INSERT INTO korban (nama, kontak, alamat) VALUES (?, ?, ?)`,
    //   [nama, kontak || null, alamat || null]
    // );

    const data = await prisma.korban.create({
      data: {
        nama,
        kontak,
        alamat,
      },
    });

    return NextResponse.json(
      { message: "Korban berhasil ditambahkan", korbanId: data.id },
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
