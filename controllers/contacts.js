const Contact = require("../models/contacts.js");

const createContact = async (req, res, next) => {
	try {
		const newContact = await Contact.create(req.body);
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
};

const listContacts = async (req, res, next) => {
	try {
		const contacts = await Contact.find();
		res.status(200).json(contacts);
	} catch (error) {
		next(error);
	}
};

const getContactById = async (req, res, next) => {
	try {
		const contact = await Contact.findById(req.params.id);
		if (!contact) {
			return res.status(404).json({ message: "Not found" });
		}
		res.status(200).json(contact);
	} catch (error) {
		next(error);
	}
};

const updateContact = async (req, res, next) => {
	try {
		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		);
		if (!updatedContact) {
			return res.status(404).json({ message: "Not found" });
		}
		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};

const removeContact = async (req, res, next) => {
	try {
		const deleted = await Contact.findByIdAndDelete(req.params.id);
		if (!deleted) {
			return res.status(404).json({ message: "Not found" });
		}
		res.status(200).json({ message: "Contact deleted successfully" });
	} catch (error) {
		next(error);
	}
};

const updateStatusContact = async (req, res, next) => {
	try {
		const { favorite } = req.body;
		if (favorite === undefined) {
			return res
				.status(400)
				.json({ message: "Missing field 'favorite'" });
		}

		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.id,
			{ favorite },
			{ new: true, runValidators: true }
		);

		if (!updatedContact) {
			return res.status(404).json({ message: "Not found" });
		}

		res.status(200).json(updatedContact);
	} catch (error) {
		next(error);
	}
};

module.exports = {
	createContact,
	listContacts,
	getContactById,
	updateContact,
	removeContact,
	updateStatusContact,
};
