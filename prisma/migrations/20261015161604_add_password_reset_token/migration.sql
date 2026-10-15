-- AlterTable
ALTER TABLE `AdminUser` ADD COLUMN `resetTokenHash` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiresAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `AdminUser_resetTokenHash_key` ON `AdminUser`(`resetTokenHash`);
