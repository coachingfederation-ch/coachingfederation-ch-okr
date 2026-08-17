SELECT cron.unschedule('role-directory-hourly-sync')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'role-directory-hourly-sync');