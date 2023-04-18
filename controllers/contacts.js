const { RequestError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../models/contact');


const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { favorite,
        // page = 1, limit = 20
    } = req.query;
    // const skip = (page - 1) * limit;
    if (favorite === 'true') { 
        const favoriteContact = await Contact.find({ owner, favorite: true})
        res.status(200).json({ favoriteContact })
        return
    }
    const allContacts = await Contact.find({ owner})
    res.status(200).json({ allContacts  })
};

const getById = async (req, res) => {
    const id = req.params.contactId;
    const result = await Contact.findById(id);
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result)
};

const add = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
};

const updateById = async (req, res) => {
   
    const id = req.params.contactId;

    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result);
};

const updateFovorite = async (req, res) => { 
    const id = req.params.contactId;

    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result);
}

const deleteById = async (req, res,) => {
    const id = req.params.contactId;
    const result = await Contact.findByIdAndRemove(id);
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
    updateFovorite: ctrlWrapper(updateFovorite),
    deleteById: ctrlWrapper(deleteById),
};