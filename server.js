const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const cors = require('cors');
app.use(
    cors({
        origin: 'http://localhost:3000', // 출처 허용 옵션
        credentials: true // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
    })
);

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Origin', req.headers.origin);
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
//     if ('OPTIONS' == req.method) {
//         res.send(200);
//     } else {
//         next();
//     }
// });

require('dotenv').config();

const jwt = require('./jwt');

app.use(
    '/auth',
    createProxyMiddleware({
        target: 'http://localhost:8081',
        changeOrigin: true //이건 나중에 빼보는 것도 테스트
    })
);

app.use('/member', [
    jwt.checkToken,
    createProxyMiddleware({
        target: 'http://localhost:8081',
        changeOrigin: true //이건 나중에 빼보는 것도 테스트
    })
]);

app.listen(8080, () => {
    console.log('listening on ' + process.env.PORT);
});
