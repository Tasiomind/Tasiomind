const config = {
  appName: 'Monitoring',
  version: '1.0.0',
  appStatus: 'dev',
  hostname: 'localhost',
  port: 4000,
  segmentWriteKey: '',
  clients: {
    allowlist: [
      {
        name: 'app',
        secret: '',
        host: 'localhost',
        port: 3000,
      },
    ],
    host: 'https://localhost:3000',
  },
  twilio: {
    accountSid: '',
    authToken: '',
    PhoneNumber: '',
  },
  sentry: {
    dsn: 'https://.ingest.de.sentry.io/',
    enabled: true,
    tracesSampleRate: 1.0,
  },
  redis: {
    clusterMode: 'disabled',
    port: 6379,
    host: 'localhost',
  },
  aws: {
    accesskeyId: '',
    secretAccessKey: '',
    region: 'eu-central-1',
    bucket: '',
    s3URL: 'https://.s3.eu-central-1.amazonaws.com',
  },
  google: {
    clientID: '.apps.googleusercontent.com',
    clientSecret: '',
  },
  apple: {},
  db: {
    dbType: 'postgres',
    postgres: {
      dev: {
        host: 'localhost',
        username: 'postgres',
        password: '',
        database: 'app',
        dialect: 'postgres',
        disableClsTransactions: true,
        port: 5432,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      },
      test: {
        host: 'localhost',
        username: 'postgres',
        password: '',
        database: 'app',
        dialect: 'postgres',
        port: 5432,
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      },
      pro: {
        host: 'localhost',
        username: 'postgres',
        password: '',
        database: 'app',
        dialect: 'postgres',
        port: 5432,
        operatorsAliases: false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000,
        },
      },
    },
  },
  mail: {
    mailFrom: '',
    smtpOptions: {
      host: '',
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: '',
        pass: '',
      },
    },
  },
  https: true,
  ssl_keys: [
    {
      key: 'config/ssl/server.key',
      cert: 'config/ssl/server.crt',
    },
  ],
  cryptoKey: 'secretKey',
};

export default config;
