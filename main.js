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

// 홈
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
})

// 회원가입
const registerRouter = require("./routers/register");
app.use("/register", [registerRouter]);

// 로그인
const loginRouter = require("./routers/login");
app.use("/login", [loginRouter]);

// 새 글
const newRouter = require("./routers/new");
app.use("/new", [newRouter]);

// 게시글 관련
const listRouter = require("./routers/list");
app.use("/list", [listRouter]);

// 댓글 관련
const commentRouter = require("./routers/comment");
app.use("/comment", [commentRouter]);

// 유저 정보
const userRouter = require("./routers/user");
app.use("/user", [userRouter]);

// 상세 페이지
app.get('/:Id', async (req, res) => {
	res.sendFile(__dirname + '/views/detail.html');
})

//수정 페이지
app.get('/:id/update', (req, res) => {
	res.sendFile(__dirname + '/views/update.html');
})


//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
