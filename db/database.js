const { Sequelize } = require('sequelize');
const { auth } = require('../config/default.json');
const _bd_name = auth.bd_name;
const _bd_user = auth.bd_user;
const _bd_password = auth.bd_password;
const _bd_host = auth.bd_host;

//имя базы данных, имя пользователя, пароль
const sequelize = new Sequelize(_bd_name, _bd_user, _bd_password, {
    host: _bd_host,
    dialect: 'mysql'
});


module.exports = sequelize;