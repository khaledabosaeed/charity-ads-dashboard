-- Initial ad platforms. Admins can add more later via /admin/platforms.
insert into platforms (name, slug) values
  ('Meta Ads', 'meta-ads'),
  ('Google Ads', 'google-ads'),
  ('TikTok Ads', 'tiktok-ads')
on conflict (slug) do nothing;
