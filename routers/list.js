const express = require("express");
const router = express.Router();
const Post = require('../schemas/posting')
const User = require('../schemas/user')
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const key = require('../secret_key');

// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// 메인 페이지 글 리스트
router.get('/', async (req, res) => {
	const post = await Post.find().sort({ "date": -1 }).select('postId title nickname date');
	let data = []
	for (i in post) {
		const postId = post[i]["postId"];
		const date = moment(post[i]["date"]).format('MM/DD HH:mm:ss')
		const title = post[i]["title"];
		const nickname = post[i]["nickname"];
		data.push({postId, date, title, nickname})
	}
	res.json(data)
})


// 상세 페이지 정보 가져오기
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title nickname content date');
	const data = {
		postId: id,
		title: sanitizeHtml(post["title"]),
		nickname: sanitizeHtml(post["nickname"]),
		content: sanitizeHtml(post["content"]),
		date: moment(post["date"]).format('MM/DD HH:mm:ss')
	}
	res.json(data);
})


// 게시글 수정 요청
router.put('/:id/update', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	const user = await User.findOne({ _id: userId })
	const post = await Post.findOne({ postId: id })
	if (user.nickname != post.nickname) {
		res.json({ msg: "fail" })
		return
	}
	const data = req.body;
	const title = sanitizeHtml(data["title"]);
	const content = sanitizeHtml(data["content"]);
	if (!(title && content)) {
		res.json({ msg: "empty" })
		return
	}
	try {
		await Post.updateOne({ postId: id }, {
			title: title,
			content: content,
		})
		res.json({ msg: "success" })
	} catch (err) {
		res.json({ msg: "fail" })
	}
})


// 게시글 삭제 처리
router.delete('/:id', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	const user = await User.findOne({ _id: userId })
	const post = await Post.findOne({ postId: id })
	if (user.nickname != post.nickname) {
		res.json({ msg: "fail" })
		return
	}
	await Post.deleteOne({ postId: id })
	.then(() => {
		res.json({ msg: "success" })
	})
	.catch(() => {
		res.json({ msg: "fail" })
	})

})

module.exports = router;
