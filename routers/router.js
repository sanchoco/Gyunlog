const express = require('express');
const router = express.Router();
const path = require('path');

// 회원가입
const registerRouter = require('./register');
router.use('/register', [registerRouter]);

// 로그인
const loginRouter = require('./login');
router.use('/login', [loginRouter]);

// 새 글
const newRouter = require('./new');
router.use('/new', [newRouter]);

// 게시글 관련
const listRouter = require('./list');
router.use('/list', [listRouter]);

// 댓글 관련
const commentRouter = require('./comment');
router.use('/comment', [commentRouter]);

// 유저 정보
const userRouter = require('./user');
router.use('/user', [userRouter]);

// 상세 페이지
router.get('/:Id', async (req, res) => {
	res.sendFile(path.resolve(__dirname, '../views/detail.html'));
});

//수정 페이지
router.get('/:id/update', (req, res) => {
	res.sendFile(path.resolve(__dirname, '../views/update.html'));
});

module.exports = router;
