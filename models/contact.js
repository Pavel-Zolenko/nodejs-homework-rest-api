const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        ref: 'user',
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    }

}, { versionKey: false, timestamps: true });

contactSchema.post('save', handleMongooseError);



const JoiAddContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

const JoiUpdateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const JoiUpdateFavoritesContactSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const Contact = model('contact', contactSchema);

const schemas = {
    JoiAddContactSchema,
    JoiUpdateContactSchema,
    JoiUpdateFavoritesContactSchema,
}

module.exports = {
    Contact,
    schemas,
};