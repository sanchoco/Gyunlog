const express = require("express");
const router = express.Router();
const Post = require('../schemas/posting')

// XSS 방지
var sanitizeHtml = require('sanitize-html');

// 시간 표기 설정
var moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");


// 메인 페이지 리스트 불러오기
router.get('/list', async (req, res) => {
	const post = await Post.find().sort({ "date": -1 }).select('postId title writer date');
	let data = []
	for (i in post) {
		const postId = post[i]["postId"];
		const date = moment(post[i]["date"]).format('MM/DD HH:mm:ss')
		const title = post[i]["title"];
		const writer = post[i]["writer"];
		data.push({postId, date, title, writer})
	}
	await res.json(data)
})

// 새로운 게시글 작성 처리
router.post('/write', async (req, res) => {
	const data = await req.body;

	const title = sanitizeHtml(data["title"]);
	const writer = sanitizeHtml(data["writer"]);
	const password = data["password"];
	const content = sanitizeHtml(data["content"]);
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

// 상세 페이지 정보 가져오기
router.get('/detail/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title writer content date');
	const data = {
		postId: id,
		title: sanitizeHtml(post["title"]),
		writer: sanitizeHtml(post["writer"]),
		content: sanitizeHtml(post["content"]),
		date: post["date"]
	}
	res.json(data)
})

// 수정을 위한 이전 정보 가져오기
router.get('/update/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title writer content');
	const data = {
		postId: id,
		title: sanitizeHtml(post["title"]),
		writer: sanitizeHtml(post["writer"]),
		content: sanitizeHtml(post["content"]),
	}
	res.json(data)
})

// 게시글 수정 처리
router.put('/update/:id', async (req, res) => {
	const id = req.params.id

	const data = await req.body;
	const title = sanitizeHtml(data["title"]);
	const writer = sanitizeHtml(data["writer"]);
	const password = sanitizeHtml(data["password"]);
	const content = sanitizeHtml(data["content"]);
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

// 게시글 삭제 처리
router.delete('/delete/:id', async (req, res) => {
	const id = req.params.id
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

module.exports = router;
