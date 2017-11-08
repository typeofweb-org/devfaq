module.exports = {
  "type": "postgres",
  "database": "fefaq",
  "synchronize": true,
  "logging": true,

  "host": "postgres",
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
