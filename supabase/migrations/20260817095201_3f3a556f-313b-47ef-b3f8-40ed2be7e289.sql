CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.unschedule('role-directory-hourly-sync')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'role-directory-hourly-sync');

SELECT cron.schedule(
  'role-directory-hourly-sync',
  '17 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://project--f71a5372-ad83-4e34-afb2-1b1f31204259.lovable.app/api/public/role-sync',
    headers := jsonb_build_object('content-type', 'application/json'),
    body := '{}'::jsonb
  );
  $$
);