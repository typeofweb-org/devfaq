module.exports = {
  "synchronize": true,
  "logging": true,

  "type": process.env.DATABASE_TYPE,
  "host": process.env.DATABASE_HOST,
  "username": process.env.DATABASE_USER,
  "database": process.env.DATABASE_DB,
  "password": process.env.DATABASE_PASSWORD,

  "entities": [
    "app/entity/**/*.ts"
  ],
  "migrations": [
    "app/migration/**/*.ts"
  ],
  "subscribers": [
    "app/subscriber/**/*.ts"
  ],
  "cli": {
    "entitiesDir": "app/entity",
    "migrationsDir": "app/migration",
    "subscribersDir": "app/subscriber"
  }
}
