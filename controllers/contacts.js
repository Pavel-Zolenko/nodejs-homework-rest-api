const { listContacts, getContactById, addContact, updateContact, removeContact } = require('../models/contacts.js')
const { RequestError, ctrlWrapper } = require('../helpers');



const getAll = async (req, res) => {
    const allContacts = await listContacts();
    res.status(200).json({ allContacts })
};

const getById = async (req, res) => {
    const id = req.params.contactId;
    const result = await getContactById(id);
    
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result)
};

const add = async (req, res) => {
    const result = await addContact(req.body);
    res.status(201).json(result);
};

const updateById = async (req, res) => {
   
    const id = req.params.contactId;
    const result = await updateContact(id, req.body);
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result);
};

const deleteById = async (req, res,) => {
    const id = req.params.contactId;
    const result = await removeContact(id);
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json({ "message": "contact deleted" });
};
  
module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
};