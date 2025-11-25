// app/api/tindakan/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/db";
import prisma from "@/app/lib/db";

export async function GET(req: Request) {
  try {
    // Ambil tindakan + info kasus
    // const [rows]: any = await pool.query(
    //   `SELECT t.*, k.jenis_kasus
    //  FROM tindakan_forensik t
    //  JOIN kasus k ON t.kasus_id = k.id
    //  ORDER BY t.id DESC`
    // );

    const data = await prisma.tindakan_forensik.findMany({
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
        waktu_pelaksanaan: "desc",
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch tindakan forensik" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { kasus_id, waktu_pelaksanaan, pec } = body;

    // await pool.query(
    //   `INSERT INTO tindakan_forensik
    //   (kasus_id, waktu_pelaksanaan, pec)
    //  VALUES (?, ?, ?)`,
    //   [
    //     kasus_id,
    //     waktu_pelaksanaan || null, // datetime
    //     pec || null,
    //   ]
    // );

    const kasus = await prisma.kasus.findUnique({
      where: { id: kasus_id },
    });

    if (!kasus) {
      return NextResponse.json({ error: "Kasus not found" }, { status: 404 });
    }

    const data = await prisma.tindakan_forensik.create({
      data: {
        kasus_id: kasus_id,
        waktu_pelaksanaan: waktu_pelaksanaan,
        pec,
      },
    });

    return NextResponse.json(
      { message: "Tindakan forensik created" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create tindakan forensik" },
      { status: 500 }
    );
  }
}
