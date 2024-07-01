const jwt = require('jsonwebtoken');
const {Token, User} = require("../../db/models/index");
const { auth } = require('../../config/default.json');

const secret_key = auth.secret_key;
const expires_in_ = auth.expires_in;
const secret_key_ref = auth.secret_key_ref;
const expires_in_ref = auth.expires_in_ref;

class Tokens{
    generateTokens(user_id, username, email) {
        const payload = {
            user_id,
            username,
            email
        }
        const accessToken = jwt.sign(payload, secret_key, {expiresIn: expires_in_})
        const refreshToken = jwt.sign(payload, secret_key_ref, { expiresIn: expires_in_ref })
        return {
            accessToken,
            refreshToken
        }
    }
     async  checkTokens(token) {
        try {
            // Ищем пользователя с таким email
            const result = await Token.findOne({
                where: {
                    Token: token
                }
            });
            return !!result;
        } catch (error) {
            throw 'Ошибка проверки на наличие tokens: '+error;
        }
    }

    async validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, secret_key);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, secret_key_ref);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({
            where: {
                user: userId
            }
        })
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }else{
            const tokenInstance = await Token.create({ user: userId, token: refreshToken });
            return tokenInstance;
        }
       
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.findOne({
            where: {
                token: refreshToken
            }
        })
        console.log(tokenData)
        if(tokenData){
            return await tokenData.destroy();
        }else{
            console.log('Не найдено')
            return null
        }
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            return null;
        }
        const userData = validateRefreshToken(refreshToken);
        const tokenFromDb = await findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            return null;
        }
        const user = await User.findById(userData.id);
        const tokens = generateTokens(user.id, user.name, user.email);

        await saveToken(user.id, tokens.refreshToken);
        return {...tokens, user: user}
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({refreshToken})
        return tokenData;
    }

}


const qwer = new Tokens();
module.exports = qwer;