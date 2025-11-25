// app/api/korban/[id]/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import prisma from "@/app/lib/db";

type Params = { params: { id: string } };

// GET - Get single korban
export async function GET(req: Request, { params }: Params) {
  try {
    const data = await prisma.korban.findUnique({
      where: { id: params.id },
      include: {
        kasus: true,
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Korban not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching korban:", error);
    return NextResponse.json(
      { error: "Failed to fetch korban" },
      { status: 500 }
    );
  }
}

// UPDATE korban berdasarkan custom_id
export async function PUT(req: Request, { params }: Params) {
  try {
    const id = params.id; // misal P001
    const body = await req.json();
    const { nama, kontak, alamat } = body;

    // Ambil id integer korban
    // const [rows]: any = await pool.query(
    //   "SELECT id FROM korban WHERE custom_id = ?",
    //   [customId]
    // );
    // if (rows.length === 0) {
    //   return NextResponse.json(
    //     { message: "Korban tidak ditemukan" },
    //     { status: 404 }
    //   );
    // }
    // const id_int = rows[0].id;

    const korban = await prisma.korban.findUnique({
      where: { id: id },
    });

    if (!korban) {
      return NextResponse.json(
        { message: "Korban tidak ditemukan" },
        { status: 404 }
      );
    }

    // await pool.query(
    //   "UPDATE korban SET nama = ?, kontak = ?, alamat = ? WHERE id = ?",
    //   [nama || null, kontak || null, alamat || null, id_int]
    // );

    const data = await prisma.korban.update({
      where: { id: id },
      data: {
        nama,
        kontak,
        alamat,
      },
    });

    return NextResponse.json({ message: "Korban updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update korban" },
      { status: 500 }
    );
  }
}

// DELETE korban berdasarkan custom_id
export async function DELETE(req: Request, { params }: Params) {
  try {
    const id = params.id;

    // Ambil id integer korban
    // const [rows]: any = await pool.query(
    //   "SELECT id FROM korban WHERE custom_id = ?",
    //   [customId]
    // );
    // if (rows.length === 0) {
    //   return NextResponse.json(
    //     { message: "Korban tidak ditemukan" },
    //     { status: 404 }
    //   );
    // }
    // const id_int = rows[0].id;

    const korbanWithKasus = await prisma.korban.findUnique({
      where: { id: id },
    });

    if (!korbanWithKasus) {
      return NextResponse.json(
        { error: "Korban tidak ditemukan" },
        { status: 400 }
      );
    }

    // await pool.query("DELETE FROM korban WHERE id = ?", [id_int]);

    await prisma.korban.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Korban deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete korban" },
      { status: 500 }
    );
  }
}
