const config = {
  mongodb: {
    url: "mongodb://127.0.0.1:27017",
    databaseName: "book-library",

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
