// 익스프레스
const express = require('express');
const app = express();
const port = 3000;

// MongoDB
const connect = require('./schemas/db');
connect();

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// 홈
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

// 라우터
const router = require('./routers/router');
app.use('/', [router]);


//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`);
});
