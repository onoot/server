/**
 * Контроллер авторизации (логин, логаут, обновление токена)
 */
const Users = require("../users/class");
const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const bcrypt = require("bcrypt");

const Tokens = require('../tokens/class')

class AuthController {
    name = "AuthController";

    /**
     * @description Функция авторизации
     * @param {*} req  - запрос методом POST передает логин и пароль
     * @param {*} res  - ответ либо соответсвующая ошибка, либо если логин и пароль верны - генерируем JWT-токен для проверки запросов пользователя.
     * @returns {*} - возвращаем описанные выше ответы
     */
    
    async registration(req, res, next) {
        try {
            /** получаем логин и пароль */
            const {email, password} = req.body

            let response = {
                status: "OK",
                message: "Успешно",
            }

            /** проверяем почту */
            let check_email = await Users.checkEmail(email);
            if (check_email) {
                response = {
                    status: "ERROR",
                    message: "Email уже зарегистрирован"
                }
                return res.status(200).json(response)
            }

            /** хешируем пароль для сохранения в бд */
            const passwd_hashed = await Users.createPasswordHash(password)
            /** сохраняем пользователя */
            await Users.regUser(
               email, passwd_hashed,
            )
            return res.status(200).json(response)
        } catch (e) {
            console.log(e)
            res.status(400).json({status: "ERROR", message: 'Ошибка: ' + e})
        }
    }

    async login(req, res) {
        try {
            /** получаем логин и пароль */
            const {email, password} = req.body
            /** если пользователя с таким логином нет то возвращаем информацию об этом */
            const user = await Users.getUserByEmail(email);


            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }
            /** Проверяем логин, пароль и активен ли юзер если не правильный - сообщаем */
            const passwd_check = await Users.checkPassword(password, user.password);

            if (user && passwd_check) {
                /** Если пароль правильный - генерируем и возвращаем JWT-токены */
                const { accessToken, refreshToken } = Tokens.generateTokens(user.id, user.name, user.email);
            
                /** Устанавливаем refresh токен в куки с флагом httpOnly */
                res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 30*24*60*60*1000 });

                await Tokens.saveToken(user.id, refreshToken)
                return res.status(200).json({ accessToken });
            } else {
                return res.status(400).json({message: 'Неправильный пароль или пароль неверный'})
            }
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка авторизации: ' + e})
        }
    }

    async logout(req, res, next) {
        const {refreshToken} = req.cookies;
        if(!refreshToken){
            return res.status(400).json({ message: 'Уже вышли' })
        }
        const log = await Tokens.removeToken(refreshToken);
        res.clearCookie('refreshToken');
        if(log){
            return res.status(200).json({message: 'Ок'})
        }else{
            res.status(400).json({message: 'Не ок'})
        }
    }

    async refresh(req, res, next) {
        const {refreshToken} = req.cookies;
        const userData = await Tokens.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
        return res.json(userData);
    }
    
    async getUsers(req, res, next){
        const users = await Users.getUsersAll()
        res.status(200).json({message: users})
    }
}

const auth = new AuthController();
module.exports = auth;