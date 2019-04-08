// tslint:disable-next-line:no-implicit-dependencies
import { warn, danger, fail } from "danger";

/**
 * Check if package-lock.json is updated when package.json is changed
 */
{
  const packageChanged = danger.git.modified_files.includes("package.json");
  const lockfileChanged = danger.git.modified_files.includes(
    "package-lock.json"
  );
  if (packageChanged && !lockfileChanged) {
    const text =
      "Changes were made to package.json, but not to package-lock.json!";
    const idea = "Perhaps you need to run `npm install`?";
    warn(`${text} - <i>${idea}</i>`, "package.json");
  } else if (!packageChanged && lockfileChanged) {
    const text =
      "Changes were made to package-lock.json, but not to package.json!";
    const idea = "Please revert package-lock.json";
    fail(`${text} - <i>${idea}</i>`, "package-lock.json");
  }
}

/**
 * Prevent modifying backup.sql
 */
{
  const backupChanged = danger.git.modified_files.includes(
    "src/migrations/backup.sql"
  );

  if (backupChanged) {
    fail(
      `Don't edit backup.sql! Create a migration script instead.`,
      "src/migrations/backup.sql"
    );
  }
}

/**
 * Prevent modifying migrations
 */
{
  const migrationsChanged = danger.git.modified_files.find(file =>
    file.includes("src/migrations")
  );

  if (migrationsChanged) {
    fail(
      `Don't edit existing migration files! Create a new migration script instead.`,
      migrationsChanged
    );
  }
}

/**
 * Add new migrations
 */
{
  const modelsChanged = danger.git.modified_files.find(file =>
    file.includes("src/models")
  );
  const modelsAdded = danger.git.created_files.find(file =>
    file.includes("src/models")
  );
  const migrationsAdded = danger.git.created_files.find(file =>
    file.includes("src/migrations")
  );

  if ((modelsChanged || modelsAdded) && !migrationsAdded) {
    warn(
      `Changes were made to models but no migrations were added. Perhaps you should create a new migration?`,
      modelsChanged || modelsAdded
    );
  }
}

/**
 * Add new migrations when consts are changed
 */
{
  const modelsConstsChanged = danger.git.modified_files.find(
    file => file === "src/models-consts.ts"
  );
  const migrationsAdded = danger.git.created_files.find(file =>
    file.includes("src/migrations")
  );

  if (modelsConstsChanged && !migrationsAdded) {
    warn(
      `Changes were made to models-consts but no migrations were added. Perhaps you should create a new migration?`,
      modelsConstsChanged
    );
  }
}
