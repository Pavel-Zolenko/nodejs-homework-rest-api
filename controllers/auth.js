const path = require('path');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const Jimp = require("jimp");
const { v4: uuidv4 } = require('uuid');

const { User } = require('../models/user');
const { RequestError, ctrlWrapper, sendEmail } = require('../helpers');

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
        throw RequestError(409, 'Email already in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: 'Verify Email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);
    
    
    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
    })
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw RequestError(401, 'Email not found');
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });

    res.json({message: 'Verification successful'})
};


const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = User.findOne({ email });
    if (!user) {
        throw RequestError(401, 'Email not found');
    }
    if (user.verify) {
        throw RequestError(401, 'Email alredy verified');
    }
    const verifyEmail = {
        to: email,
        subject: 'Verify Email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({
        message: 'Verify email send success'
    })
    
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        throw RequestError(401, 'Email or password invalid')
    }

    if (!user.verify) {
        throw RequestError(401, 'Email not verified')
    }
    
    const compareResult = await bcrypt.compare(password, user.password);
    if (!compareResult) {
        throw RequestError(401, 'Email or password invalid')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: {
            "email": email,
            "subscription": user.subscription
        }
    });
};

const getCurrent = async (req, res) => {
    const { email, name } = req.user;
    res.json({ email, name });
};

const logout = async (req, res) => { 
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json({ massage: 'Logout success' });
}

const updateAvatar = async (req, res) => { 
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;

    // change size avatar
    const img = await Jimp.read(tempUpload);
    img.resize(250, 250);
    img.write(tempUpload);
    // ----

    const resultUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join('avatars', filename);
       
    await User.findByIdAndUpdate(_id, { avatarURL });
    
    res.json({ avatarURL });
}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
};
