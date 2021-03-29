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

// 회원가입
const registerRouter = require("./routers/registerApi");
app.use("/register", [registerRouter]);

// 회원가입
const loginRouter = require("./routers/loginApi");
app.use("/login", [loginRouter]);


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



//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
