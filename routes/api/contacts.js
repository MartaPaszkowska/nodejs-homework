const express = require("express");

const router = express.Router();

const {
	createContact,
	listContacts,
	getContactById,
	updateContact,
	removeContact,
	updateStatusContact,
} = require("../../controllers/contacts");

const { contactSchema } = require("../../models/validation");

router.put("/:id", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		await updateContact(req, res, next);
	} catch (error) {
		next(error);
	}
});

router.get("/", listContacts);

router.get("/:id", getContactById);

router.post("/", async (req, res, next) => {
	try {
		const { error } = contactSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}
		await createContact(req, res, next);
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", removeContact);

router.patch("/:id/favorite", updateStatusContact);

module.exports = router;
