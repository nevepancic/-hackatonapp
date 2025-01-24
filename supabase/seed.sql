-- Insert tickets for existing attractions
INSERT INTO tickets (id, attraction_id, name, description, price, currency, validity_start, validity_end, created_at, updated_at)
VALUES
  -- Tickets for attraction 4f17fab2-77c1-48f0-85e5-840273e59fa5
  (gen_random_uuid(), '4f17fab2-77c1-48f0-85e5-840273e59fa5', 'Adult Standard', 'Standard admission ticket for adults (18+)', 29.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '4f17fab2-77c1-48f0-85e5-840273e59fa5', 'Child Standard', 'Standard admission ticket for children (4-17)', 19.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '4f17fab2-77c1-48f0-85e5-840273e59fa5', 'Family Pack', 'Admission for 2 adults and 2 children with 15% discount', 89.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction 50b3fb1a-81e5-464c-be51-07c1e1accf6b
  (gen_random_uuid(), '50b3fb1a-81e5-464c-be51-07c1e1accf6b', 'Morning Pass', 'Valid from opening until 2 PM', 24.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '50b3fb1a-81e5-464c-be51-07c1e1accf6b', 'Evening Pass', 'Valid from 2 PM until closing', 22.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '50b3fb1a-81e5-464c-be51-07c1e1accf6b', 'Full Day VIP', 'Full day access with priority entry and guided tour', 49.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction 1f0c3f4e-e6ea-4b82-af71-556adcaaa206
  (gen_random_uuid(), '1f0c3f4e-e6ea-4b82-af71-556adcaaa206', 'Single Entry', 'One-time entry valid any day', 15.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '1f0c3f4e-e6ea-4b82-af71-556adcaaa206', 'Group Pass', 'Entry for groups of 5 or more (per person)', 12.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction 576e8f78-ea15-4deb-b6ad-4606a1d32ba5
  (gen_random_uuid(), '576e8f78-ea15-4deb-b6ad-4606a1d32ba5', 'Premium Experience', 'All-inclusive premium experience with special perks', 79.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '576e8f78-ea15-4deb-b6ad-4606a1d32ba5', 'Basic Entry', 'Standard entry ticket', 39.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), '576e8f78-ea15-4deb-b6ad-4606a1d32ba5', 'Student Pass', 'Special rate for students with valid ID', 29.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction a81952af-302c-4f49-86f3-1da641fa0a27
  (gen_random_uuid(), 'a81952af-302c-4f49-86f3-1da641fa0a27', 'Weekend Special', 'Valid for weekends only with bonus activities', 45.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'a81952af-302c-4f49-86f3-1da641fa0a27', 'Weekday Pass', 'Valid Monday through Friday', 35.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction a6b41091-b59d-4e02-bf11-4850a72d0031
  (gen_random_uuid(), 'a6b41091-b59d-4e02-bf11-4850a72d0031', 'Season Pass', 'Unlimited entry for the entire season', 199.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'a6b41091-b59d-4e02-bf11-4850a72d0031', 'Day Pass', 'Full day access to all attractions', 59.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'a6b41091-b59d-4e02-bf11-4850a72d0031', 'Express Pass', 'Skip-the-line access to all attractions', 89.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction a979fc72-19d9-4535-9020-a53f477511b5
  (gen_random_uuid(), 'a979fc72-19d9-4535-9020-a53f477511b5', 'Early Bird Special', 'Special rate for early morning entry (before 11 AM)', 25.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'a979fc72-19d9-4535-9020-a53f477511b5', 'Sunset Package', 'Evening admission with special sunset activities', 32.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'a979fc72-19d9-4535-9020-a53f477511b5', 'Photography Pass', 'Special access for photography enthusiasts', 45.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),

  -- Tickets for attraction ae5acc57-f826-4d30-979d-be6c99d298c1
  (gen_random_uuid(), 'ae5acc57-f826-4d30-979d-be6c99d298c1', 'All Access Pass', 'Complete access to all areas and special events', 69.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'ae5acc57-f826-4d30-979d-be6c99d298c1', 'Basic Tour', 'Standard guided tour experience', 29.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()),
  (gen_random_uuid(), 'ae5acc57-f826-4d30-979d-be6c99d298c1', 'Group Experience', 'Special package for groups of 10 or more', 249.99, 'EUR', '2024-03-01 00:00:00', '2024-12-31 23:59:59', NOW(), NOW()); 