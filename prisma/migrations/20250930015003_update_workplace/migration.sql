/*
  Warnings:

  - You are about to drop the column `work_place` on the `applicants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."applicants" DROP COLUMN "work_place",
ADD COLUMN     "workplace" TEXT;
