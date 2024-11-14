const express = require("express");
const {
	listContacts,
	getContactById,
	addContact,
	removeContact,
	updateContact,
} = require("../../models/contacts");

const router = express.Router();

router.get("/", async (req, res, next) => {
	try {
		const contacts = await listContacts();
		res.status(200).json(contacts);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const contact = await getContactById(id);
		if (!contact) {
			return res.status(404).json({ message: "Not found" });
		}
		res.status(200).json(contact);
	} catch (error) {
		next(error);
	}
});

router.post("/", async (req, res, next) => {
	try {
		const { name, email, phone } = req.body;
		if (!name || !email || !phone) {
			return res.status(400).json({ message: "Missing required field" });
		}
		const newContact = await addContact(name, email, phone);
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const deleted = await removeContact(contactId);
		if (!deleted) {
			return res.status(404).json({ message: "Not found" });
		}
		res.status(200).json({ message: "Contact deleted" });
	} catch (error) {
		next(error);
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		const { contactId } = req.params;
		const { name, email, phone } = req.body;

		if (!Object.keys(req.body).length) {
			return res.status(400).json({ message: "Missing required field" });
		}

		const updatedContact = await updateContact(
			contactId,
			name,
			email,
			phone
		);
		if (!updatedContact) {
			return res.status(404).json({ message: "Not found" });
		}

		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
