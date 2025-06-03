// Système de migration pour mettre à jour des tables de la BDD sans utiliser
// sequelize.alter()
module.exports = {
    async up(queryInterface, Sequelize){
        await queryInterface.addColumn(
            'Users',
            'birth_date',
            {
                type: Sequelize.DataTypes.DATEONLY
            }
        )
    },
    async down(queryInterface, Sequelize){
        await queryInterface.removeColumn(
            'Users',
            'birth_date'
        )
    }
};