const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = require('../core/orm');

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING(255),
        validate: {
            isEmail: true,
        },
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    birth_date: {
        type: DataTypes.DATEONLY
    },
    comment: {
        type: DataTypes.TEXT
    }
});

User.beforeCreate(async user => {
    const codedPassword = await bcrypt.hash(
        user.password,
        12  // Number of salt rounds
    );
    user.password = codedPassword;
});

module.exports = User;