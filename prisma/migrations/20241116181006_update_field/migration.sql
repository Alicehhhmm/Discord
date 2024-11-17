/*
  Warnings:

  - You are about to drop the column `inviteUrl` on the `server` table. All the data in the column will be lost.
  - Added the required column `inviteCode` to the `Server` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `server` DROP COLUMN `inviteUrl`,
    ADD COLUMN `inviteCode` TEXT NOT NULL;
