require('dotenv').config({ path: '../server/.env' });

const config = {
  mongodb: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017",
    databaseName: process.env.DB_NAME || "book-library",

    options: {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      //   connectTimeoutMS: 3600000,
      //   socketTimeoutMS: 3600000,
    },
  },
  migrationsDir: "common/database/seeders",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs",
};

module.exports = config;
