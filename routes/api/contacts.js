const express = require('express');
const router = express.Router();

const ctrl = require('../../controllers/contacts');
const { validateBody, isValidId }  = require('../../middlewares');
const { schemas } = require('../../models/contact');

router.get('/', ctrl.getAll);

router.get('/:contactId', isValidId, ctrl.getById);

router.post('/', validateBody(schemas.JoiAddContactSchema), ctrl.add);

router.put('/:contactId', isValidId, validateBody(schemas.JoiUpdateContactSchema), ctrl.updateById);

router.patch('/:contactId/favorite', isValidId, validateBody(schemas.JoiUpdateFavoritesContactSchema), ctrl.updateFovorite);

router.delete('/:contactId', isValidId, ctrl.deleteById);


module.exports = router
