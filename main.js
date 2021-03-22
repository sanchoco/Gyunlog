// 익스프레스
const express = require('express')
const app = express()
const port = 3000

// XSS 방지

// MongoDB
const connect = require('./schemas/db');
connect();

// 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// ejs 세팅
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// api 라우터
const apiRouter = require("./routers/crud");
app.use("/api", [apiRouter]);

// 홈
app.get('/', (req, res) => {
	res.render('index');
})

// 수정 페이지
app.get('/write', (req, res) => {
	res.render('write');
})

// 상세 페이지
app.get('/detail/:Id', async (req, res) => {
	res.render('detail');
})

//수정 페이지
app.get('/update/:id', (req, res) => {
	res.render('update');
})

//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
