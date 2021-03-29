// 익스프레스
const express = require('express')
const app = express()
const port = 3000

// MongoDB
const connect = require('./schemas/db');
connect();

// 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// api 라우터
const apiRouter = require("./routers/api");
app.use("/api", [apiRouter]);

// 홈
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
})

// 수정 페이지
app.get('/post', (req, res) => {
	res.sendFile(__dirname + '/views/post.html');
})

// 상세 페이지
app.get('/detail/:Id', async (req, res) => {
	res.sendFile(__dirname + '/views/detail.html');
})

//수정 페이지
app.get('/update/:id', (req, res) => {
	res.sendFile(__dirname + '/views/update.html');
})

//회원가입 페이지
app.get('/register', (req, res) => {
	res.sendFile(__dirname + '/views/register.html');
})

//로그인 페이지
app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/views/login.html');
})


//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
