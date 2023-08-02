require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const verify = async (token) => {
    let decoded;
    try {
        // verify를 통해 값 decode!
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        if (err.message === 'jwt expired') {
            console.log('expired token');
            return TOKEN_EXPIRED;
        } else if (err.message === 'invalid token') {
            console.log('invalid token');
            return TOKEN_INVALID;
        } else {
            console.log('invalid token');
            return TOKEN_INVALID;
        }
    }
    return decoded;
};

module.exports = {
    checkToken: async (req, res, next) => {
        var token = req.cookies.accessToken;

        if (!token) {
            console.log('empty token');
            return res.json({ message: 'empty token' });
        }

        const user = await verify(token);
        //유효기간 만료
        if (user === TOKEN_EXPIRED) {
            console.log('expired token');
            return res.json({ message: 'expired token' });
        }
        //유효하지 않은 토큰
        if (user === TOKEN_INVALID) {
            console.log('invalid token');
            return res.json({ message: 'invalid token' });
        }
        if (user.id === undefined) {
            console.log('invalid token');
            return res.json({ message: 'invalid token' });
        }

        next();
    }
};
