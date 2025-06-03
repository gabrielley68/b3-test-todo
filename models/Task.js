const { DataTypes } = require('sequelize');

const sequelize = require('../core/orm');

const Task = sequelize.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT
    },
    done: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

module.exports = Task;