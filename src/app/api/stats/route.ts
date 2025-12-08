import prisma from "@/lib/db"

export async function GET() {
  const totalKorban = await prisma.korban.count();
  const totalKasus = await prisma.kasus.count();
  const totalBarangBukti = await prisma.barang_bukti.count();
  const totalTindakan = await prisma.tindakan_forensik.count();

  return Response.json({
    totalKorban,
    totalKasus,
    totalBarangBukti,
    totalTindakan,
  });
}
