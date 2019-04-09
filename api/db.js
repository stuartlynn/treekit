import {Sequelize} from 'sequelize';
import fs from 'fs';

const db = new Sequelize(
  //process.env.PGDATABASE,
  //process.env.PGUSER,
  //process.env.PGPASSWORD,
  'docker',
  'docker',
  'docker',
  {
    host: 'database',
    dialect: 'postgres',
    pool: {
      // application-side connection pool configuration
      max: 1000,
      min: 0,
      idle: 50000,
    },
  },
);

export default async () => {
  let models = {};
  const modelDefs = fs.readdirSync('./models');
  modelDefs.forEach(fileName => {
    let {define} = require('./models/' + fileName);
    models[fileName.split('.')[0]] = define(db);
  });
  modelDefs.forEach(fileName => {
    let {associate} = require('./models/' + fileName);
    associate(models);
  });

  
  return [models, db];
};
