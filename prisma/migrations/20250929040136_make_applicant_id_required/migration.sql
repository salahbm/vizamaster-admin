/*
  Warnings:

  - Made the column `applicant_id` on table `alerts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."alerts" ALTER COLUMN "applicant_id" SET NOT NULL;
