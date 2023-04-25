const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
     email: {
        type: String,
        required: [true, 'Email is required'],
        
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, 'Password is required'],
    },
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        required: true,
    },
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const JoiRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid(...subscriptionList).required(),
    
});

const JoiLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),    
})


const schemas = {
    JoiRegisterSchema,
    JoiLoginSchema,
}

const User = model('user', userSchema);

module.exports = {
    schemas,
    User,
};