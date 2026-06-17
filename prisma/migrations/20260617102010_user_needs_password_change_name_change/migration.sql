/*
  Warnings:

  - You are about to drop the column `needsPasswordChnage` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "needsPasswordChnage",
ADD COLUMN     "needsPasswordChange" BOOLEAN NOT NULL DEFAULT false;
