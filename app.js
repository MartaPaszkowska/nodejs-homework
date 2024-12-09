const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	res.status(500).json({ message: err.message });
});

const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(MONGO_URI)
	.then(() => console.log("Database connection successful"))
	.catch((error) => {
		console.error("Database connection error:", error.message);
		process.exit(1);
	});

module.exports = app;
