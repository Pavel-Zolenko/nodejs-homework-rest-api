const { isValidObjectId } = require('mongoose');
const { RequestError } = require('../helpers');

const isValidId = (req, res, next) => {
    const  id  = req.params.contactId;
    if (!isValidObjectId(id)) {
        next(RequestError(400, `${id} is not valid id`))
    }
    next();
};

module.exports = isValidId;