import { NextResponse } from "next/server";
import prisma from "@/lib/db";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// =========================
// GET /api/kasus/[id]
// =========================
export async function GET(req: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    const kasus = await prisma.kasus.findUnique({
      where: { id },
      include: {
        korban: true,
      },
    });

    if (!kasus) {
      return NextResponse.json(
        { error: "Kasus tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(kasus);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json(
      { error: "Gagal mengambil data kasus" },
      { status: 500 }
    );
  }
}

// =========================
// PUT /api/kasus/[id]
// =========================
export async function PUT(req: Request, context: RouteParams) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    // Convert semua field tanggal ke Date jika ada
    const tanggal_kejadian =
      body.tanggal_kejadian ? new Date(body.tanggal_kejadian) : null;

    const updated = await prisma.kasus.update({
      where: { id },
      data: {
        status_kasus: body.status_kasus,
        korban_id: body.korban_id || null,
        jenis_kasus: body.jenis_kasus,
        tanggal_kejadian,
        ringkasan: body.ringkasan,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui data kasus" },
      { status: 500 }
    );
  }
}

// =========================
// DELETE /api/kasus/[id]
// =========================
export async function DELETE(req: Request, context: RouteParams) {
  try {
    const { id } = await context.params;

    await prisma.kasus.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kasus berhasil dihapus" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Gagal menghapus kasus" },
      { status: 500 }
    );
  }
}
