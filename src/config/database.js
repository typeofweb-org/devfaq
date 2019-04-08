const dotenv = require("dotenv");
const { getConfig } = require("./index");

if (getConfig("NODE_ENV") !== "production") {
  dotenv.config({ path: ".env.dev" });
}

const config = {
  username: getConfig("DB_USERNAME"),
  password: getConfig("DB_PASSWORD"),
  database: getConfig("DB_NAME"),
  host: getConfig("DB_HOSTNAME"),
  dialect: "postgres"
};

module.exports = {
  development: config,
  test: {
    ...config,
    database: "database_test",
    host: "127.0.0.1"
  },
  production: config,
  staging: config
};
