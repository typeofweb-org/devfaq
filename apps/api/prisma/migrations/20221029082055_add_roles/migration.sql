INSERT INTO "UserRole" (id, "createdAt", "updatedAt")
VALUES
  ('user', NOW(), NOW()),
  ('admin', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
