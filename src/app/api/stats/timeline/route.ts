import prisma from "@/lib/db";

export async function GET() {
  const result = await prisma.$queryRaw`
    SELECT
      to_char(tanggal_kejadian, 'YYYY-MM-DD') AS date,
      CAST(COUNT(*) AS INTEGER) AS cases
    FROM kasus
    GROUP BY 1
    ORDER BY 1;
  `;

  return Response.json(result);
}
