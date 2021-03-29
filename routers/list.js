const express = require("express");
const router = express.Router();
const Post = require('../schemas/posting')
// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

// 메인 페이지 글 리스트
router.get('/', async (req, res) => {
	const post = await Post.find().sort({ "date": -1 }).select('postId title writer date');
	let data = []
	for (i in post) {
		const postId = post[i]["postId"];
		const date = moment(post[i]["date"]).format('MM/DD HH:mm:ss')
		const title = post[i]["title"];
		const writer = post[i]["writer"];
		data.push({postId, date, title, writer})
	}
	res.json(data)
})


// 상세 페이지 정보 가져오기
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const post = await Post.findOne({ postId: id })
		.select('postId title writer content date');
	const data = {
		postId: id,
		title: sanitizeHtml(post["title"]),
		writer: sanitizeHtml(post["writer"]),
		content: sanitizeHtml(post["content"]),
		date: moment(post["date"]).format('MM/DD HH:mm:ss')
	}
	res.json(data);
})


// 게시글 수정 처리
router.put('/:id/update', async (req, res) => {
	const id = req.params.id

	const data = req.body;
	const title = sanitizeHtml(data["title"]);
	const writer = "임시";
	const content = sanitizeHtml(data["content"]);
	if (!(title && content)) {
		res.json({ msg: "empty" })
	}

	Post.updateOne({ postId: id }, {
		title: title,
		writer: writer,
		content: content,
	})
	.then(() => {
		res.json({ msg: "success" })
	})
	.catch(() => {
		res.json({ msg: "fail" })
	})
})


// 게시글 삭제 처리
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	Post.deleteOne({ postId: id })
	.then(() => {
		res.json({ msg: "success" })
	})
	.catch(() => {
		res.json({ msg: "fail" })
	})
})

module.exports = router;
