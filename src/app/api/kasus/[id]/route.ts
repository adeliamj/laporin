// app/api/kasus/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import prisma from "@/lib/db";

type Params = { params: { id: string } };

// GET single kasus
export async function GET(request: Request, { params }: Params) {
  try {
    const kasus = await prisma.kasus.findUnique({
      where: { id: params.id },
      include: {
        korban: true,
        barang_bukti: true,
        tindakan_forensik: true,
      },
    });

    if (!kasus) {
      return NextResponse.json({ error: "Kasus not found" }, { status: 404 });
    }

    return NextResponse.json(kasus);
  } catch (error) {
    console.error("Error fetching kasus:", error);
    return NextResponse.json(
      { error: "Failed to fetch kasus" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const id = params.id;
    const body = await req.json();
    const { status_kasus } = body;

    if (!status_kasus) {
      return NextResponse.json(
        { message: "Status kasus wajib diisi" },
        { status: 400 }
      );
    }

    // Ambil data kasus yang sudah ada
    // const [rows]: any = await pool.query("SELECT * FROM kasus WHERE id = ?", [
    //   id,
    // ]);
    // if (!rows || rows.length === 0) {
    //   return NextResponse.json(
    //     { message: "Kasus tidak ditemukan" },
    //     { status: 404 }
    //   );
    // }

    const kasus = await prisma.kasus.findMany({
      where: { id: id },
    });

    if (!kasus) {
      return NextResponse.json(
        { message: "Kasus tidak ditemukan" },
        { status: 404 }
      );
    }

    // Update hanya status_kasus
    // await pool.query(
    //   `UPDATE kasus
    //    SET status_kasus = ?
    //    WHERE id = ?`,
    //   [status_kasus, id]
    // );

    const data = await prisma.kasus.update({
      where: { id: id },
      data: { status_kasus: status_kasus },
    });

    return NextResponse.json({
      message: "Status kasus berhasil diupdate",
      data,
    });
  } catch (err) {
    console.error("Error deleting kasus:", err);
    return NextResponse.json(
      { error: "Failed to update kasus" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = params.id;
    // await pool.query("DELETE FROM kasus WHERE id = ?", [id]);

    await prisma.kasus.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Kasus deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting kasus:", err);
    return NextResponse.json(
      { error: "Failed to delete kasus" },
      { status: 500 }
    );
  }
}
