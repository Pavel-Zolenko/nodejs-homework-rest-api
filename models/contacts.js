const fs = require("fs").promises;
const path = require("path");
const { v4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');


const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

const getContactById = async (contactId) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: v4(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newContact;
}

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(el => el.id === id);
  if (index === -1) { 
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}



const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(el => el.id === id);
  if (index === -1) { 
    return null;
  }
  contacts[index] = {id, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[index];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
