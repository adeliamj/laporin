-- CreateTable
CREATE TABLE `barang_bukti` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kasus_id` INTEGER NOT NULL,
    `jenis_bukti` VARCHAR(100) NULL,
    `lokasi_penyimpanan` VARCHAR(100) NULL,
    `waktu_penyimpanan` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `kasus_id`(`kasus_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kasus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `korban_id` INTEGER NULL,
    `korban_terkait` VARCHAR(100) NULL,
    `jenis_kasus` VARCHAR(100) NOT NULL,
    `tanggal_kejadian` DATETIME(0) NULL,
    `ringkasan` TEXT NULL,
    `status_kasus` ENUM('open', 'in_progress', 'closed') NULL DEFAULT 'open',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `korban_id`(`korban_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `korban` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(100) NOT NULL,
    `kontak` VARCHAR(50) NULL,
    `alamat` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tindakan_forensik` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kasus_id` INTEGER NOT NULL,
    `waktu_pelaksanaan` DATETIME(0) NULL,
    `pec` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `kasus_id`(`kasus_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `barang_bukti` ADD CONSTRAINT `barang_bukti_ibfk_1` FOREIGN KEY (`kasus_id`) REFERENCES `kasus`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `kasus` ADD CONSTRAINT `kasus_ibfk_1` FOREIGN KEY (`korban_id`) REFERENCES `korban`(`id`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `tindakan_forensik` ADD CONSTRAINT `tindakan_forensik_ibfk_1` FOREIGN KEY (`kasus_id`) REFERENCES `kasus`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;
