const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

async function getData() {
	try {
		const data = await fs.readFile(contactsPath);
		return JSON.parse(data.toString());
	} catch (error) {
		console.error("Błąd:", error.message);
	}
}

async function editionData(contacts) {
	try {
		await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
	} catch (error) {
		console.error("Błąd:", error.message);
	}
}

async function listContacts() {
	try {
		const contacts = await getData();
		return contacts;
	} catch (error) {
		console.error("Błąd podczas listowania kontaktów:", error.message);
	}
}

async function getContactById(contactId) {
	try {
		const contacts = await getData();
		const contact = contacts.find((c) => c.id === contactId);
		if (!contact) {
			console.log("Nie znaleziono kontaktu o podanym ID");
			return null;
		}
		return contact;
	} catch (error) {
		console.error("Błąd podczas pobierania kontaktu:", error.message);
	}
}

async function removeContact(contactId) {
	try {
		const contacts = await getData();
		const updatedContacts = contacts.filter((c) => c.id !== contactId);
		await editionData(updatedContacts);
		console.log("Usunięto kontakt");
		return true;
	} catch (error) {
		console.error("Błąd podczas usuwania kontaktu:", error.message);
		return false;
	}
}

async function addContact(name, email, phone) {
	try {
		const contacts = await getData();
		const newContact = {
			id: Date.now().toString(),
			name,
			email,
			phone,
		};
		contacts.push(newContact);
		await editionData(contacts);
		console.log("Dodano nowy kontakt:", newContact);
		return newContact;
	} catch (error) {
		console.error("Błąd podczas dodawania kontaktu:", error.message);
	}
}

async function updateContact(contactId, name, email, phone) {
	try {
		const contacts = await getData();

		const contactExists = contacts.some((c) => c.id === contactId);
		if (!contactExists) {
			console.log("Nie znaleziono kontaktu o podanym ID");
			return null;
		}

		const updatedContacts = contacts.map((c) =>
			c.id === contactId ? { ...c, name, email, phone } : c
		);

		await editionData(updatedContacts);
		return { id: contactId, name, email, phone };
	} catch (error) {
		console.error("Błąd podczas aktualizacji kontaktu:", error.message);
	}
}

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
