-- 1. Add column nullable first
ALTER TABLE "public"."alerts" ADD COLUMN "applicant_id" TEXT;

-- 2. Backfill applicant_id using comment → applicant relation
UPDATE "public"."alerts" a
SET applicant_id = c.applicant_id
FROM "public"."comments" c
WHERE a.comment_id = c.id;

-- 3. (Optional fallback) If some alerts are still NULL, set a default or delete them
-- UPDATE "public"."alerts" SET applicant_id = '<some-existing-applicant-id>' WHERE applicant_id IS NULL;

-- 4. Enforce NOT NULL once backfill is done
ALTER TABLE "public"."alerts" ALTER COLUMN "applicant_id" SET NOT NULL;

-- 5. Add foreign key
ALTER TABLE "public"."alerts"
ADD CONSTRAINT "alerts_applicant_id_fkey"
FOREIGN KEY ("applicant_id") REFERENCES "public"."applicants"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
