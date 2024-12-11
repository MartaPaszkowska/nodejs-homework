const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

async function authMiddleware(req, res, next) {
	const token = req.headers.authorization?.split(" ")[1];
	if (!req.headers.authorization || !token) {
		return res.status(401).json({ message: "Not authorized" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (!user || user.token !== token) {
			return res.status(401).json({ message: "Not authorized" });
		}
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Not authorized" });
	}
}

module.exports = authMiddleware;
