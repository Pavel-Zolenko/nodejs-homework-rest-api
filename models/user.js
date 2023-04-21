const Joi = require('joi');
const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');



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
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
}, { versionKey: false, timestamps: true });

userSchema.post('save', handleMongooseError);

const JoiRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().required(),
    
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