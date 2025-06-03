const { DataTypes } = require('sequelize');

const sequelize = require('../core/orm');

const Type = sequelize.define('Type', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = Type;