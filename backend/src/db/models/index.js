import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
import config from 'config/app.config.js';

const basename = _basename(__filename);
const db = {};
const dbConfig = config.db[config.db.dbType][config.appStatus];

const sequelize = new Sequelize(dbConfig);

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false, logging: false });
    // await sequelize.drop();

    console.log('✨ A gateway to the database world has been successfully opened.');
    console.log(
      `🚀 sequelize ORM connected to ${dbConfig.dialect} @ ${dbConfig.host}:${dbConfig.port}`,
    );
  } catch (err) {
    console.error('🐉 Oh no! A dragon is blocking the way to the database:', err);
    console.log("🛡️ But don't worry, our heroic development team will conquer this dragon!");
    console.log("🚀 Until then, let's focus on improving our skills and saving the world!");
    process.exit(1);
  }
};

initializeDatabase();

readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    const model = require(join(__dirname, file)).default(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
