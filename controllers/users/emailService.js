const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	host: process.env.MAILGUN_HOST,
	port: 587,
	auth: {
		user: process.env.MAILGUN_USER,
		pass: process.env.MAILGUN_PASS,
	},
});

async function sendVerificationEmail(email, verificationToken) {
	const verificationLink = `http://localhost:3000/api/users/verify/${verificationToken}`;

	await transporter.sendMail({
		from: "<no-reply@example.com>",
		to: email,
		subject: "Verify your email",
		html: `<p>Please verify your email by clicking the link below:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
	});
}

module.exports = sendVerificationEmail;
