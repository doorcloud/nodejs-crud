require("dotenv").config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "db_door",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "postgres", // 'mysql' | 'postgres' | 'mariadb'
  },
  test: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "db_door",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "postgres", // 'mysql' | 'postgres' | 'mariadb'
  },
  production: {
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "db_door",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: process.env.DB_DIALECT || "postgres", // 'mysql' | 'postgres' | 'mariadb'
  },
};
