-- Comments must be created through the create-comment Edge Function (OpenAI moderation + service role insert).
-- Drop direct client INSERT so authenticated users cannot bypass moderation.
-- No-op if public.comments does not exist yet (e.g. before community schema.sql is applied).

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'comments'
  ) THEN
    DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
  END IF;
END $$;
