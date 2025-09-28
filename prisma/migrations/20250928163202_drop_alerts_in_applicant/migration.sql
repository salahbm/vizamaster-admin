/*
  Warnings:

  - You are about to drop the column `applicant_id` on the `alerts` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."alerts" DROP CONSTRAINT "alerts_applicant_id_fkey";

-- AlterTable
ALTER TABLE "public"."alerts" DROP COLUMN "applicant_id";
