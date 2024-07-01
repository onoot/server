const sequelize = require('../database.js');
const {DataTypes, Model} = require("sequelize");

// Определение модели `User`
class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuids: {
        type: DataTypes.TEXT,
        default: ''
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
});

module.exports = User;