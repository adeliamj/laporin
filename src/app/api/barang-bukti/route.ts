import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import prisma from "@/app/lib/db";

export async function GET() {
  // const [rows]: any = await pool.query(
  //   `SELECT b.*, k.jenis_kasus
  //    FROM barang_bukti b
  //    JOIN kasus k ON b.kasus_id = k.id
  //    ORDER BY b.id DESC`
  // );
  // return NextResponse.json(rows);

  try {
    const barangBukti = await prisma.barang_bukti.findMany({
      include: {
        kasus: {
          select: {
            id: true,
            jenis_kasus: true,
            status_kasus: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return NextResponse.json(barangBukti);
  } catch (error) {
    console.error("Error fetching barang bukti:", error);
    return NextResponse.json(
      { error: "Failed to fetch barang bukti" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // const body = await req.json();
  // const { kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } = body;

  // await pool.query(
  //   `INSERT INTO barang_bukti
  //     (kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan)
  //    VALUES (?, ?, ?, ?)`,
  //   [
  //     kasus_id,
  //     jenis_bukti || null,
  //     lokasi_penyimpanan || null,
  //     waktu_penyimpanan || null,
  //   ]
  // );

  // return NextResponse.json(
  //   { message: "Barang bukti created" },
  //   { status: 201 }
  // );

  try {
    const body = await req.json();
    const { kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } =
      body;

    // Validasi kasus exists
    const kasus = await prisma.kasus.findUnique({
      where: { id: kasus_id },
    });

    if (!kasus) {
      return NextResponse.json({ error: "Kasus not found" }, { status: 404 });
    }

    const barangBukti = await prisma.barang_bukti.create({
      data: {
        kasus_id: kasus_id,
        jenis_bukti,
        lokasi_penyimpanan,
        waktu_penyimpanan: waktu_penyimpanan || null,
      },
      include: {
        kasus: true,
      },
    });

    return NextResponse.json(barangBukti, { status: 201 });
  } catch (error) {
    console.error("Error creating barang bukti:", error);
    return NextResponse.json(
      { error: "Failed to create barang bukti" },
      { status: 500 }
    );
  }
}
