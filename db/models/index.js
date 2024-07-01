const Sequelize = require('sequelize');
const sequelize = require('../database');

// Импортирование моделей
const User = require('./users');
const Token = require('./tokens');

// Синхронизация с базой данных
// sequelize.sync({ force: false })
//     .then(() => {
//         console.log('Таблицы были успешно синхронизированы.');
//     })
//     .catch((error) => {
//         console.error('Произошла ошибка при синхронизации:', error);
//     });

// Определение связей

// Экспортирование объектов для использования в других частях приложения
module.exports = {
    sequelize,
    Sequelize,
    User,
    Token
};