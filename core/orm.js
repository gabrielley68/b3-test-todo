// Configuration de Sequelize
const Sequelize = require('sequelize');

const sequelizeInstance = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {host: 'localhost', dialect: 'mysql', logging: false}
);

module.exports = sequelizeInstance;