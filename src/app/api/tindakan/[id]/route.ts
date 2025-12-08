import { NextResponse } from "next/server";
import prisma from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

// GET - Get single tindakan forensik
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const tindakan = await prisma.tindakan_forensik.findUnique({
      where: { id },
      include: {
        kasus: true,
      },
    });

    if (!tindakan) {
      return NextResponse.json(
        { error: "Tindakan forensik not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tindakan);
  } catch (error) {
    console.error("Error fetching tindakan forensik:", error);
    return NextResponse.json(
      { error: "Failed to fetch tindakan forensik" },
      { status: 500 }
    );
  }
}

// PUT - Update tindakan forensik
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { waktu_pelaksanaan, pec } = body;

    const tindakan = await prisma.tindakan_forensik.update({
      where: { id },
      data: {
        waktu_pelaksanaan: waktu_pelaksanaan
          ? new Date(waktu_pelaksanaan)
          : null,
        pec,
        updated_at: new Date(),
      },
      include: {
        kasus: true,
      },
    });

    return NextResponse.json(tindakan);
  } catch (error) {
    console.error("Error updating tindakan forensik:", error);
    return NextResponse.json(
      { error: "Failed to update tindakan forensik" },
      { status: 500 }
    );
  }
}

// DELETE - Delete tindakan forensik
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.tindakan_forensik.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Tindakan forensik deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tindakan forensik:", error);
    return NextResponse.json(
      { error: "Failed to delete tindakan forensik" },
      { status: 500 }
    );
  }
}
