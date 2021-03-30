const express = require("express");
const router = express.Router();
const User = require('../schemas/user')
const authMiddleware = require('../middlewares/auth');
const jwt = require('jsonwebtoken');
const key = require('../secret_key');

router.get('/', authMiddleware, async (req, res) => {
	const { token } = req.headers;
	const { userId } = jwt.verify(token, key);
	user = await User.findOne({ _id: userId },{"nickname":true})
	if (user) {
		res.json({ nickname: user.nickname })
	} else {
		res.status(401).json({msg:"fail"})
	}
})

module.exports = router;
