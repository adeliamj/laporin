import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: ambil semua kasus beserta nama korban
export async function GET() {
  try {
    // const [rows]: any = await pool.query(
    //   `SELECT k.*, kb.nama AS nama_korban
    //    FROM kasus k
    //    LEFT JOIN korban kb ON k.korban_id = kb.id
    //    ORDER BY k.id DESC`
    // );

    const kasus = await prisma.kasus.findMany({
      include: {
        korban: true,
        barang_bukti: true,
        tindakan_forensik: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(kasus);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch kasus" },
      { status: 500 }
    );
  }
}

// POST: tambah kasus baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      korban_id,
      korban_terkait,
      jenis_kasus,
      tanggal_kejadian,
      ringkasan,
    } = body;

    if (!jenis_kasus || !ringkasan) {
      return NextResponse.json(
        { message: "Field wajib diisi" },
        { status: 400 }
      );
    }

    // korban_id boleh null
    // const [result]: any = await pool.query(
    //   `INSERT INTO kasus (korban_id, korban_terkait, jenis_kasus, tanggal_kejadian, ringkasan, status_kasus)
    //    VALUES (?, ?, ?, ?, ?, ?)`,
    //   [
    //     korban_id || null,
    //     korban_terkait || null,
    //     jenis_kasus,
    //     tanggal_kejadian || null,
    //     ringkasan,
    //     "open",
    //   ]
    // );

    const tanggalISO = tanggal_kejadian? new Date(tanggal_kejadian + "T00:00:00.000Z"): null;

    const kasus = await prisma.kasus.create({
      data: {
        korban_id: korban_id || null,
        korban_terkait: korban_terkait || null,
        jenis_kasus,
        tanggal_kejadian: tanggalISO || null,
        ringkasan,
        status_kasus: "open",
      },
      include: {
        korban: true,
      },
    });

    return NextResponse.json(
      { message: "Kasus berhasil ditambahkan", kasusId: kasus.id },
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
