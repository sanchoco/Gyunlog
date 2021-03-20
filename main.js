const express = require('express')
const app = express()
const port = 3000

// 미들웨어
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));

// ejs 세팅
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// 홈
app.get('/', (req, res) => {
	res.render('index');
})

app.get('/detail', (req, res) => {
	res.render('detail');
})

app.get('/write', (req, res) => {
	res.render('write');
})

app.get('/update', (req, res) => {
	res.render('update');
})

//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
