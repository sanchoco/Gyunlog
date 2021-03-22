// 익스프레스
const express = require('express')
const app = express()
const port = 3000
const Post = require('./schemas/posting')

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

// 홈
app.get('/', (req, res) => {
	res.render('index');
})

app.get('/write', (req, res) => {
	res.render('write');
})

app.get('/detail/:Id', async (req, res) => {
	res.render('detail');
})

app.get('/update/:id', (req, res) => {
	res.render('update');
})

app.get('/api/list', async (req, res) => {
	const post = await Post.find().sort({ "date": -1 }).select('postId title writer date');
	await res.json(post)
})

app.post('/api/write', async (req, res) => {
	const data = await req.body;

	const title = data["title"];
	const writer = data["writer"];
	const password = data["password"];
	const content = data["content"];
	if (!(title && writer && password && content)) {
		res.json({ msg: "fail" })
	} else {
		const lasted = await Post.findOne().sort({ "postId": -1 });
		let index = 1
		if (lasted) {
			index = lasted["postId"] + 1
		}
		await Post.create({
			postId: index,
			title: title,
			writer: writer,
			content: content,
			password: password
		});
		res.json({ msg: "success" })
	}
});

app.get('/api/detail/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title writer content date');
	const data = {
		postId: id,
		title: post["title"],
		writer: post["writer"],
		content: post["content"],
		date: post["date"]
	}
	res.json(data)
})

app.get('/api/update/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title writer content');
	const data = {
		postId: id,
		title: post["title"],
		writer: post["writer"],
		content: post["content"],
	}
	res.json(data)
})

app.put('/api/update/:id', async (req, res) => {
	const id = req.params.id

	const data = await req.body;
	const title = data["title"];
	const writer = data["writer"];
	const password = data["password"];
	const content = data["content"];
	const db_post = await Post.findOne({ postId: id })
		.select('password');
	if (!(title && writer && password && content)) {
		res.json({ msg: "empty" })
	}
	else if (db_post["password"] != data["password"]) {
		res.json({ msg: "fail" })
	}
	else {
		await Post.updateOne({ postId: id }, {
			title: title,
			writer: writer,
			content: content,
			password: password
		})
		.then(() => {
			res.json({ msg: "success" })
		})
		.catch(() => {
			res.json({ msg: "fail" })
		})
	}
})

app.delete('/api/delete/:id', async (req, res) => {
	const id = await req.params.id
	const data = await req.body;
	const password = data["password"];
	const db_post = await Post.findOne({ postId: id })
		.select('password');
	if (db_post["password"] != password) {
		res.json({ msg: "fail" })
	}
	else {
		await Post.deleteOne({ postId: id })
			.then(() => {
				res.json({ msg: "success" })
			})
			.catch(() => {
				res.json({ msg: "fail" })
			})
	}
})

//listen
app.listen(port, () => {
	console.log(`Listening at http://localhost:${port}`)
})
