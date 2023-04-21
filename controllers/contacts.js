const { RequestError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../models/contact');


const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 5, name, email, phone, favorite } = req.query;
   
    const query = { owner };
    
    if (name) {
        query.name = name;
    }

    if (email) {
        query.email = email;
    }

    if (phone) {
        query.phone = phone;
    }

    if (favorite) {
        query.favorite = favorite;
    }
    
    
    const skip = (page - 1) * limit;

    const result = await Contact.find(query, "", { skip, limit }).populate(
        "owner",
        "email subscription"
    );
    
    res.status(200).json({ result })
   
};

const getById = async (req, res) => {
    const id = req.params.contactId;
    const { _id: owner } = req.user;
    
    const result = await Contact.findOne({ _id: id, owner }).populate("owner", "email subscription");
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
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, { new: true });
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result);
};

const updateFovorite = async (req, res) => { 
    const id = req.params.contactId;
    const { _id: owner } = req.user;

    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, { new: true });
    if (!result) {
        throw RequestError(404, 'Not Found');
    }
    res.status(200).json(result);
}

const deleteById = async (req, res) => {
    const id = req.params.contactId;
    const { _id: owner } = req.user;
    console.log(id)
    const result = await Contact.findOneAndRemove({_id: id, owner});
    if (!result) {
        throw RequestError(404, 'contact Not Found');
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