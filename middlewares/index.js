const { validateBody, updateValidation, updateFavoriteValidation } = require('./validateBody');
const isValidId = require('./isValidId');
const authenticate = require('./authenticate');

module.exports = {
    validateBody,
    updateValidation,
    updateFavoriteValidation,
    isValidId,
    authenticate,
}