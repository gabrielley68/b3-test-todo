module.exports = {
    async up(queryInterface, Sequelize){
        await queryInterface.addColumn(
            'Users',
            'comment',
            {
                type: Sequelize.DataTypes.TEXT
            }
        )
    },
    async down(queryInterface, Sequelize){
        await queryInterface.removeColumn(
            'Users',
            'comment'
        )
    }
};