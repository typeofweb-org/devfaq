// tslint:disable-next-line:no-implicit-dependencies
import { warn, danger, fail } from 'danger';

export const apiDanger = async () => {
  /**
   * Check if yarn.lock is updated when package.json is changed
   */
  {
    const packageChanged = danger.git.modified_files.includes('package.json');
    const lockfileChanged = danger.git.modified_files.includes('yarn.lock');
    if (packageChanged && !lockfileChanged) {
      const text = 'Changes were made to package.json, but not to yarn.lock!';
      const idea = 'Perhaps you need to run `yarn install`?';
      warn(`${text} - <i>${idea}</i>`, 'package.json');
    } else if (!packageChanged && lockfileChanged) {
      const text = 'Changes were made to yarn.lock, but not to package.json!';
      const idea = 'Please revert yarn.lock';
      fail(`${text} - <i>${idea}</i>`, 'yarn.lock');
    }
  }

  /**
   * Prevent modifying migrations
   */
  {
    const migrationsChanged = danger.git.modified_files.find((file) =>
      file.includes('src/migrations')
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
    const modelsChanged = danger.git.modified_files.find((file) => file.includes('src/models'));
    const modelsAdded = danger.git.created_files.find((file) => file.includes('src/models'));
    const migrationsAdded = danger.git.created_files.find((file) =>
      file.includes('src/migrations')
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
      (file) => file === 'src/models-consts.ts'
    );
    const migrationsAdded = danger.git.created_files.find((file) =>
      file.includes('src/migrations')
    );

    if (modelsConstsChanged && !migrationsAdded) {
      warn(
        `Changes were made to models-consts but no migrations were added. Perhaps you should create a new migration?`,
        modelsConstsChanged
      );
    }
  }
};
