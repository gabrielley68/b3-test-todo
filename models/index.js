const sequelize = require('../core/orm');

// Import des modèles
const Type = require('./Type');
const Task = require('./Task');
const User = require('./User');

// Déclaration des relations entre les modèles
Task.belongsTo(Type);
Type.hasMany(Task);

Task.belongsTo(User);
User.hasMany(Task);

// À décommenter pour mettre à jour la BDD
// sequelize.sync({alter: true});

module.exports = {
    Type: Type,
    Task: Task,
    User: User,
    sequelize,
}