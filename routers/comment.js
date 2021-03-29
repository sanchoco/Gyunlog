const express = require("express");
const router = express.Router();
const Post = require('../schemas/posting');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const key = require('../secret_key');
// XSS 방지
const sanitizeHtml = require('sanitize-html');
// 시간 표기 설정
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

router.get('/:id', async (req, res) => {
	const id = req.params.id;
	comments = await Comment.find({ postId: id }).sort({ "commentId": -1 });

	let data = []
	for (i in comments) {
		const nickname = comments[i]["nickname"];
		const date = moment(comments[i]["date"]).format('MM/DD HH:mm:ss')
		const comment = comments[i]["comment"];
		data.push({nickname, date, comment })
	}
	res.json(data);
})

// 새 댓글 작성
router.post('/:id', authMiddleware, async (req, res) => {
	const id = req.params.id;
	const data = await req.body;
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	const user = await User.findOne({ _id: userId },{"nickname":true})
	if (!data.comment) {
		res.json({ msg: "empty" });
		return
	}
	let index = 1
	const lasted = await Comment.findOne().sort({ "commentId": -1 });
	if (lasted) {
		index = lasted["commentId"] + 1
	}
	await Comment.create({
		commentId: index,
		comment : sanitizeHtml(data.comment),
		postId: id,
		nickname: user.nickname,
		date: Date.now()
	})
	res.json({ msg: "success" });
})

module.exports = router;
