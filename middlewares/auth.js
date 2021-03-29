const jwt = require('jsonwebtoken');
const key = require('../secret_key');

module.exports = (req, res, next) => {
	const { token } = req.headers;
	if (!token) {
		res.status(401).send({ message: '로그인 후 이용할 수 있습니다.' });
		return
	}
	try {
		jwt.verify(token, key);
		next();
	} catch (err) {
		res.status(401).send({ message: '로그인 후 이용할 수 있습니다.' });
		return
	}
}
