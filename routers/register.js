const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const bcrypt = require('bcrypt'); // 비밀번호 암호화
// XSS 방지
const sanitizeHtml = require('sanitize-html');
const path = require('path');
const { check_id, check_password, check_nickname } = require('../source/verification');

router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../') + '/views/register.html');
});

router.post('/', async (req, res) => {
	const { id, password, password_re, nickname } = req.body;
	if (!(id && password && password_re && nickname)) {
		res.json({ msg: 'empty' });
		return;
	}
	if (!check_id(id)) {
		res.json({ msg: 'wrong_id' });
		return;
	}
	if (!check_password(id, password)) {
		res.json({ msg: 'wrong_password' });
		return;
	}

	if (!check_nickname(nickname)) {
		res.json({ msg: 'wrong_nickname' });
		return;
	}

	let exists = await User.findOne({ id }).exec();
	if (exists) {
		res.json({ msg: 'already_id' });
		return;
	}
	exists = await User.findOne({ nickname }).exec();
	if (exists) {
		res.json({ msg: 'already_nickname' });
		return;
	}
	if (password != password_re) {
		res.json({ msg: 'diff_password' });
		return;
	}
	try {
		await User.create({ // 검증 후 유저 생성
			id: sanitizeHtml(id),
			password: bcrypt.hashSync(password, 10), // 암호화 저장
			nickname: sanitizeHtml(nickname)
		});
	} catch {
		res.json({ msg: 'error' });
		return;
	}
	res.json({ msg: 'success' });

	// 양식 검사 필요
});

module.exports = router;
