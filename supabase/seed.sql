-- Seed: Gen AI Summit Asia 2026 event row + 20 dummy attendees

insert into public.events (id, name, capacity, starts_at, ends_at, is_live)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Gen AI Summit Asia 2026',
  3000,
  '2026-08-08 02:00:00+00',  -- 10:00 AM MYT (UTC+8)
  '2026-08-09 10:00:00+00',  -- 6:00 PM MYT day 2
  true
);

-- 20 pre-loaded dummy attendees so display previews immediately
insert into public.attendees
  (first_name, last_name, email, phone, country_code, avatar_seed, avatar_color, is_dummy, display_consent, checked_in_at)
values
  ('Aishah',   'Rahman',   'dummy_aishah@example.com',   '0123456001', '+60', 'bot-seed-001', '#FF4F00', true, true, now() - interval '55 minutes'),
  ('Wei Ming', 'Lim',      'dummy_weiming@example.com',  '0123456002', '+60', 'bot-seed-002', '#FFB800', true, true, now() - interval '52 minutes'),
  ('Priya',    'Nair',     'dummy_priya@example.com',    '0123456003', '+60', 'bot-seed-003', '#00E5FF', true, true, now() - interval '49 minutes'),
  ('Ahmad',    'Abdullah', 'dummy_ahmad@example.com',    '0123456004', '+60', 'bot-seed-004', '#FF4F00', true, true, now() - interval '46 minutes'),
  ('Mei Lin',  'Tan',      'dummy_meilin@example.com',   '0123456005', '+60', 'bot-seed-005', '#FFB800', true, true, now() - interval '43 minutes'),
  ('Arjun',    'Kumar',    'dummy_arjun@example.com',    '0123456006', '+65', 'bot-seed-006', '#00E5FF', true, true, now() - interval '40 minutes'),
  ('Siti',     'Ismail',   'dummy_siti@example.com',     '0123456007', '+60', 'bot-seed-007', '#FF4F00', true, true, now() - interval '37 minutes'),
  ('Hao Ren',  'Wong',     'dummy_haoren@example.com',   '0123456008', '+60', 'bot-seed-008', '#FFB800', true, true, now() - interval '34 minutes'),
  ('Anisha',   'Krishnan', 'dummy_anisha@example.com',   '0123456009', '+60', 'bot-seed-009', '#00E5FF', true, true, now() - interval '31 minutes'),
  ('Kenji',    'Nakamura', 'dummy_kenji@example.com',    '0123456010', '+81', 'bot-seed-010', '#FF4F00', true, true, now() - interval '28 minutes'),
  ('Farah',    'Yusof',    'dummy_farah@example.com',    '0123456011', '+60', 'bot-seed-011', '#FFB800', true, true, now() - interval '25 minutes'),
  ('Jason',    'Chan',     'dummy_jason@example.com',    '0123456012', '+60', 'bot-seed-012', '#00E5FF', true, true, now() - interval '22 minutes'),
  ('Nurul',    'Hassan',   'dummy_nurul@example.com',    '0123456013', '+60', 'bot-seed-013', '#FF4F00', true, true, now() - interval '19 minutes'),
  ('Ravi',     'Pillai',   'dummy_ravi@example.com',     '0123456014', '+60', 'bot-seed-014', '#FFB800', true, true, now() - interval '16 minutes'),
  ('Xin Yi',   'Ng',       'dummy_xinyi@example.com',    '0123456015', '+65', 'bot-seed-015', '#00E5FF', true, true, now() - interval '13 minutes'),
  ('Aaron',    'Lee',      'dummy_aaron@example.com',    '0123456016', '+60', 'bot-seed-016', '#FF4F00', true, true, now() - interval '10 minutes'),
  ('Maya',     'Devi',     'dummy_maya@example.com',     '0123456017', '+60', 'bot-seed-017', '#FFB800', true, true, now() - interval '7 minutes'),
  ('Hiroshi',  'Tanaka',   'dummy_hiroshi@example.com',  '0123456018', '+81', 'bot-seed-018', '#00E5FF', true, true, now() - interval '4 minutes'),
  ('Lakshmi',  'Rajan',    'dummy_lakshmi@example.com',  '0123456019', '+60', 'bot-seed-019', '#FF4F00', true, true, now() - interval '2 minutes'),
  ('Zhi Hao',  'Chen',     'dummy_zhihao@example.com',   '0123456020', '+65', 'bot-seed-020', '#FFB800', true, true, now() - interval '30 seconds');
