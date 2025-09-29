-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."FileType" AS ENUM ('PASSPORT', 'VISA', 'CV', 'INSURANCE', 'FLIGHT_DOCUMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ApplicantStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'CONFIRMED_PROGRAM', 'HIRED', 'HOTEL_REJECTED', 'APPLICANT_REJECTED', 'FIRED');

-- CreateEnum
CREATE TYPE "public"."VisaStatus" AS ENUM ('NOT_APPLIED', 'STILL_WORKING', 'RETURNED', 'DEPARTED');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('EDITOR', 'ADMIN', 'CREATOR');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "public"."UserRole" NOT NULL DEFAULT 'EDITOR',
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sidebar" (
    "id" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelRu" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sidebar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sidebar_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sidebarItemId" TEXT NOT NULL,

    CONSTRAINT "sidebar_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."group_codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelRu" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."codes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelRu" TEXT NOT NULL,
    "groupCodeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."applicants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "middle_name" TEXT,
    "gender" "public"."Gender" NOT NULL DEFAULT 'MALE',
    "passport_number" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "phone_number_additional" TEXT,
    "email" TEXT NOT NULL,
    "country_of_residence" TEXT NOT NULL,
    "address_line_1" TEXT NOT NULL,
    "address_line_2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip_code" TEXT,
    "nationality" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "preferredJobTitle" TEXT DEFAULT 'Worker',
    "country_of_employment" TEXT NOT NULL,
    "partner" TEXT NOT NULL,
    "status" "public"."ApplicantStatus" NOT NULL DEFAULT 'NEW',
    "languages" TEXT[],
    "createdBy" TEXT NOT NULL DEFAULT 'System',
    "updatedBy" TEXT NOT NULL DEFAULT 'System',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isAlert" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."visas" (
    "id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "issued" BOOLEAN NOT NULL DEFAULT false,
    "issue_date" TIMESTAMP(3),
    "departure_date" TIMESTAMP(3),
    "arrived" BOOLEAN NOT NULL DEFAULT false,
    "arrival_date" TIMESTAMP(3),
    "status" "public"."VisaStatus" NOT NULL DEFAULT 'STILL_WORKING',
    "returned_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."work_history" (
    "id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "responsibilities" TEXT NOT NULL,
    "achievements" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."files" (
    "id" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "file_type" "public"."FileType" NOT NULL,
    "file_key" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "applicant_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicant_id" TEXT,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_active_idx" ON "public"."users"("active");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "public"."sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "sidebar_href_key" ON "public"."sidebar"("href");

-- CreateIndex
CREATE INDEX "sidebar_user_userId_idx" ON "public"."sidebar_user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "sidebar_user_userId_sidebarItemId_key" ON "public"."sidebar_user"("userId", "sidebarItemId");

-- CreateIndex
CREATE UNIQUE INDEX "group_codes_code_key" ON "public"."group_codes"("code");

-- CreateIndex
CREATE INDEX "group_codes_code_idx" ON "public"."group_codes"("code");

-- CreateIndex
CREATE UNIQUE INDEX "codes_code_key" ON "public"."codes"("code");

-- CreateIndex
CREATE INDEX "codes_code_idx" ON "public"."codes"("code");

-- CreateIndex
CREATE INDEX "codes_groupCodeId_idx" ON "public"."codes"("groupCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "applicants_userId_key" ON "public"."applicants"("userId");

-- CreateIndex
CREATE INDEX "applicants_userId_idx" ON "public"."applicants"("userId");

-- CreateIndex
CREATE INDEX "applicants_country_of_employment_idx" ON "public"."applicants"("country_of_employment");

-- CreateIndex
CREATE INDEX "applicants_partner_idx" ON "public"."applicants"("partner");

-- CreateIndex
CREATE INDEX "applicants_isArchived_idx" ON "public"."applicants"("isArchived");

-- CreateIndex
CREATE INDEX "applicants_isAlert_idx" ON "public"."applicants"("isAlert");

-- CreateIndex
CREATE INDEX "visas_applicant_id_idx" ON "public"."visas"("applicant_id");

-- CreateIndex
CREATE INDEX "visas_status_idx" ON "public"."visas"("status");

-- CreateIndex
CREATE INDEX "work_history_applicant_id_idx" ON "public"."work_history"("applicant_id");

-- CreateIndex
CREATE INDEX "files_applicant_id_idx" ON "public"."files"("applicant_id");

-- CreateIndex
CREATE INDEX "files_file_type_idx" ON "public"."files"("file_type");

-- CreateIndex
CREATE INDEX "comments_applicant_id_idx" ON "public"."comments"("applicant_id");

-- CreateIndex
CREATE INDEX "comments_author_id_idx" ON "public"."comments"("author_id");

-- CreateIndex
CREATE INDEX "alerts_comment_id_idx" ON "public"."alerts"("comment_id");

-- CreateIndex
CREATE INDEX "alerts_user_id_idx" ON "public"."alerts"("user_id");

-- CreateIndex
CREATE INDEX "alerts_is_read_idx" ON "public"."alerts"("is_read");

-- CreateIndex
CREATE UNIQUE INDEX "alerts_comment_id_user_id_key" ON "public"."alerts"("comment_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sidebar" ADD CONSTRAINT "sidebar_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."sidebar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sidebar_user" ADD CONSTRAINT "sidebar_user_sidebarItemId_fkey" FOREIGN KEY ("sidebarItemId") REFERENCES "public"."sidebar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sidebar_user" ADD CONSTRAINT "sidebar_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."codes" ADD CONSTRAINT "codes_groupCodeId_fkey" FOREIGN KEY ("groupCodeId") REFERENCES "public"."group_codes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."visas" ADD CONSTRAINT "visas_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."work_history" ADD CONSTRAINT "work_history_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_applicant_id_fkey" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

