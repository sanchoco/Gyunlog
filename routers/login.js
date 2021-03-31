const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const bcrypt = require('bcrypt'); // 비밀번호 암호화
const jwt = require('jsonwebtoken');
const path = require('path');

// 로그인 페이지
router.get('/', async (req, res) => {
	res.sendFile(path.join(__dirname, '../') + '/views/login.html');
});

// 로그인 인증 요청
router.post('/', async (req, res) => {
	const { id, password } = req.body;
	if (!id || !password) {
		//id, password가 비어있을 때
		res.json({ msg: 'empty' });
		return;
	}
	user = await User.findOne({ id }).exec();
	if (user) {
		await bcrypt.compare(password, user.password, (err, same) => {
			// 암호화된 비밀번호와 일치 여부
			if (same) {
				// 비밀번호가 정상적으로 입력된 경우
				const key = require('../secret_key'); // 시크릿키 가져오기
				const token = jwt.sign({ userId: user._id }, key); // _id로 고유 토큰 생성
				res.json({ msg: 'success', token });
			} else {
				res.json({ msg: 'fail' });
			}
		});
	} else {
		res.json({ msg: 'fail' });
	}
});

module.exports = router;
