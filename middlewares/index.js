const { validateBody, updateValidation, updateFavoriteValidation } = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');
const upload = require('./upload');

module.exports = {
    validateBody,
    updateValidation,
    updateFavoriteValidation,
    isValidId,
    authenticate,
    upload,
}