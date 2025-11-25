// app/api/barang-bukti/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import prisma from "@/lib/db";

type Params = { params: { id: string } };

// GET single barang bukti
export async function GET(req: Request, { params }: Params) {
  try {
    const barangBukti = await prisma.barang_bukti.findUnique({
      where: { id: params.id },
      include: {
        kasus: true,
      },
    });

    if (!barangBukti) {
      return NextResponse.json(
        { error: "Barang bukti not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(barangBukti);
  } catch (error) {
    console.error("Error fetching barang bukti:", error);
    return NextResponse.json(
      { error: "Failed to fetch barang bukti" },
      { status: 500 }
    );
  }
}

// UPDATE barang bukti berdasarkan id
export async function PUT(req: Request, { params }: Params) {
  // const id_int = Number(params.id);
  // const body = await req.json();
  // const { kasus_id, jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } = body;

  // // Validasi kasus_id wajib
  // if (!kasus_id) {
  //   return NextResponse.json(
  //     { message: "Kasus harus dipilih" },
  //     { status: 400 }
  //   );
  // }

  // // Cek barang bukti ada
  // const [rows]: any = await pool.query(
  //   "SELECT id FROM barang_bukti WHERE id = ?",
  //   [id_int]
  // );
  // if (rows.length === 0) {
  //   return NextResponse.json(
  //     { message: "Barang bukti tidak ditemukan" },
  //     { status: 404 }
  //   );
  // }

  // await pool.query(
  //   `UPDATE barang_bukti
  //    SET kasus_id = ?, jenis_bukti = ?, lokasi_penyimpanan = ?, waktu_penyimpanan = ?
  //    WHERE id = ?`,
  //   [
  //     kasus_id,
  //     jenis_bukti || null,
  //     lokasi_penyimpanan || null,
  //     waktu_penyimpanan || null,
  //     id_int,
  //   ]
  // );

  // return NextResponse.json({ message: "Barang bukti updated" });

  try {
    const body = await req.json();
    const { jenis_bukti, lokasi_penyimpanan, waktu_penyimpanan } = body;

    const barangBukti = await prisma.barang_bukti.update({
      where: { id: params.id },
      data: {
        jenis_bukti,
        lokasi_penyimpanan,
        waktu_penyimpanan: waktu_penyimpanan
          ? new Date(waktu_penyimpanan)
          : null,
        updated_at: new Date(),
      },
      include: {
        kasus: true,
      },
    });

    return NextResponse.json(barangBukti);
  } catch (error) {
    console.error("Error updating barang bukti:", error);
    return NextResponse.json(
      { error: "Failed to update barang bukti" },
      { status: 500 }
    );
  }
}

// DELETE barang bukti berdasarkan id
export async function DELETE(req: Request, { params }: Params) {
  // const id_int = Number(params.id);

  // const [rows]: any = await pool.query(
  //   "SELECT id FROM barang_bukti WHERE id = ?",
  //   [id_int]
  // );
  // if (rows.length === 0) {
  //   return NextResponse.json(
  //     { message: "Barang bukti tidak ditemukan" },
  //     { status: 404 }
  //   );
  // }

  // await pool.query("DELETE FROM barang_bukti WHERE id = ?", [id_int]);

  // return NextResponse.json({ message: "Barang bukti deleted" });

  try {
    await prisma.barang_bukti.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Barang bukti deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting barang bukti:", error);
    return NextResponse.json(
      { error: "Failed to delete barang bukti" },
      { status: 500 }
    );
  }
}
