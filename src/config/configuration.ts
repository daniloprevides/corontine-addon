import path = require("path");
export default () => ({
    port: parseInt(process.env.PORT, 10) || 6000,
    env: process.env.ENV || "DEVELOPMENT",
    corsOrigin: "*",
    authorizationUrl: process.env.AUTHORIZATION_URL || "http://localhost:3000",
    api: {
        title: process.env.API_TITLE || "Addons",
        description: process.env.API_DESCRIPTION || 'Addons',
        version: process.env.API_VERSION || 'API Version',
        path: process.env.API_PATH || 'api'
    },
    database: {
        type: process.env.DB_TYPE || "mysql",
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "addon",
        entities: [
            __dirname + '/../**/*.entity{.ts,.js}',
        ],
        autoSchemaSync: true,
        synchronize: process.env.DB_SYNCRONIZE === "true" ? true : false || true,
        migrations: [__dirname + '/../migration/*{.ts,.js}'],
        dropSchema: true,
        migrationsRun: false,
        logging: true,
        cli: {
          migrationsDir: 'src/migration',
        },        
    },
    testDatabase: {
      type: "sqlite",
      database: ":memory:",
      dropSchema: false,
      synchronize: false,
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
      autoSchemaSync: false,
      migrations: [__dirname + '/../migration/*{.ts,.js}'],
      migrationsRun: false,
      logging: false,
      cli: {
        migrationsDir: 'src/migration',
      },        
    }
  });