-- CreateTable
CREATE TABLE `media` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `director` VARCHAR(191) NULL,
    `budget` DECIMAL(65, 30) NULL,
    `location` VARCHAR(191) NULL,
    `duration` INTEGER NULL,
    `year` INTEGER NULL,
    `genre` VARCHAR(191) NULL,
    `rating` DECIMAL(65, 30) NULL,
    `description` TEXT NULL,
    `language` VARCHAR(191) NULL,
    `posterUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
