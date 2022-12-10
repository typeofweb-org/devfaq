INSERT INTO "QuestionStatus" (id, "createdAt", "updatedAt")
VALUES
  ('pending', NOW(), NOW()),
  ('accepted', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "QuestionCategory" (id, "createdAt", "updatedAt")
VALUES
  ('html', NOW(), NOW()),
  ('css', NOW(), NOW()),
  ('js', NOW(), NOW()),
  ('angular', NOW(), NOW()),
  ('react', NOW(), NOW()),
  ('git', NOW(), NOW()),
  ('other', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO "QuestionLevel" (id, "createdAt", "updatedAt")
VALUES
  ('junior', NOW(), NOW()),
  ('mid', NOW(), NOW()),
  ('senior', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
