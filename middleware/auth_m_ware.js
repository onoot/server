const jwt = require('jsonwebtoken');
const { auth } = require('../config/default.json');

const secret_key = auth.secret_key;

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "не авторизован" });
        } else {
            const decodejwt = jwt.verify(token, secret_key, function (err, decoded) {
                if (decoded) {
                    next();
                } else {
                    return res.status(401).json({ message: "не авторизован" });
                }
            });
            req.user = decodejwt;
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Что-то пошло не так" });
    }
}
