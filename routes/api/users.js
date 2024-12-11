const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/userSchema");
const {
	userSchema,
	loginSchema,
	subscriptionSchema,
} = require("../../models/validation");
const authMiddleware = require("../../middleware/authorization");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
	try {
		const { error } = userSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: "Email already in use" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			email,
			password: hashedPassword,
		});

		const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		newUser.token = token;
		await newUser.save();

		res.status(201).json({
			user: {
				token,
				email: newUser.email,
				subscription: newUser.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { error } = loginSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const { email, password } = req.body;

		const user = await User.findOne({ email });
		if (!user) {
			return res
				.status(401)
				.json({ message: "Email or password is wrong" });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			return res
				.status(401)
				.json({ message: "Email or password is wrong" });
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		user.token = token;
		await user.save();

		res.status(200).json({
			token,
			user: {
				email: user.email,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		next(error);
	}
});

router.get("/logout", authMiddleware, async (req, res, next) => {
	try {
		const user = req.user;

		user.token = null;
		await user.save();

		res.status(200).json({ message: "Successfully logged out" });
	} catch (error) {
		next(error);
	}
});

router.get("/current", authMiddleware, async (req, res, next) => {
	try {
		const user = req.user;

		res.status(200).json({
			email: user.email,
			subscription: user.subscription,
		});
	} catch (error) {
		next(error);
	}
});

router.patch("/", authMiddleware, async (req, res, next) => {
	try {
		const { error } = subscriptionSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const user = await User.findByIdAndUpdate(
			req.user._id,
			{ subscription: req.body.subscription },
			{ new: true, runValidators: true }
		);

		res.status(200).json({
			email: user.email,
			subscription: user.subscription,
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
