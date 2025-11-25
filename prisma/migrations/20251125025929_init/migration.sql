-- CreateEnum
CREATE TYPE "users_role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "kasus_status_kasus" AS ENUM ('open', 'in_progress', 'closed');

-- CreateTable
CREATE TABLE "barang_bukti" (
    "id" TEXT NOT NULL,
    "kasus_id" TEXT NOT NULL,
    "jenis_bukti" VARCHAR(100),
    "lokasi_penyimpanan" VARCHAR(100),
    "waktu_penyimpanan" TIMESTAMP(0),
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "barang_bukti_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kasus" (
    "id" TEXT NOT NULL,
    "korban_id" TEXT,
    "korban_terkait" VARCHAR(100),
    "jenis_kasus" VARCHAR(100) NOT NULL,
    "tanggal_kejadian" TIMESTAMP(0),
    "ringkasan" TEXT,
    "status_kasus" "kasus_status_kasus" DEFAULT 'open',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kasus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "korban" (
    "id" TEXT NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "kontak" VARCHAR(50),
    "alamat" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "korban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tindakan_forensik" (
    "id" TEXT NOT NULL,
    "kasus_id" TEXT NOT NULL,
    "waktu_pelaksanaan" TIMESTAMP(0),
    "pec" TEXT,
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tindakan_forensik_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "users_role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "barang_bukti_kasus_id_idx" ON "barang_bukti"("kasus_id");

-- CreateIndex
CREATE INDEX "kasus_korban_id_idx" ON "kasus"("korban_id");

-- CreateIndex
CREATE INDEX "tindakan_forensik_kasus_id_idx" ON "tindakan_forensik"("kasus_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "barang_bukti" ADD CONSTRAINT "barang_bukti_kasus_id_fkey" FOREIGN KEY ("kasus_id") REFERENCES "kasus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kasus" ADD CONSTRAINT "kasus_korban_id_fkey" FOREIGN KEY ("korban_id") REFERENCES "korban"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tindakan_forensik" ADD CONSTRAINT "tindakan_forensik_kasus_id_fkey" FOREIGN KEY ("kasus_id") REFERENCES "kasus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
