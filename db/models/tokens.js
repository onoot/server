const sequelize = require('../database.js');
const {DataTypes, Model} = require("sequelize");

// Определение модели `User`
class Tokens extends Model {}

Tokens.init({
    user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Token',
    tableName: 'Tokens',
    timestamps: true,
});

module.exports = Tokens;