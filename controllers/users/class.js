const bcrypt = require("bcrypt");
const {User} = require("../../db/models/index");

class Users{
     async  checkEmail(email) {
        try {
            // Ищем пользователя с таким email
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            return !!user;
        } catch (error) {
            throw 'Ошибка проверки на наличие email: '+error;
        }
    }

     async createPasswordHash(passwd) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        return bcrypt.hashSync(passwd, salt);

    }

    async regUser(email, passwd_hashed) {
        try {
            // Создаем нового пользователя с помощью модели Sequelize
            const newUser = await User.create({
                name: email,
                email,
                password: passwd_hashed,
            });
            return newUser;
        } catch (error) {
            throw 'Ошибка при создании нового пользователя: '+error;
        }
    }

    /**Методы для авторизации**/

    async getUserByEmail(email){
        try {
            // Ищем пользователя с таким email
            const user = await User.findOne({where: {email: email}});
            if(user){
                return user
            }else{
                return null;
            }
        } catch (error) {
            throw 'Ошибка проверки на наличие email: '+error;
        }
    }

    async getUsersAll(){
        try{
            const users = await User.findAll();
            return users;
        }catch(e){
            return null;
        }
    }

    async checkPassword(password, passwordHash) {
        return await bcrypt.compare(password, passwordHash);
    }

}


const qwer = new Users();
module.exports = qwer;