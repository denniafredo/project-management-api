const { body, validationResult } = require('express-validator');
const User = require("../models/user");
const jwt = require("../helpers/jwt");
const { encrypt, compare } = require('../helpers/encrypt');
const mongoose = require('mongoose');

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        if (!users.length) {
            next({ code: 404, msg: 'User is empty' })
        }
        const sanitizedUsers = users.map(user => {
            return { name: user.name, email: user.email };
        });
        res.status(200).json(sanitizedUsers);
    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        let user = await User.findById(req.params.id);
        if (!user) {
            next({ code: 404, msg: 'User not Found' })
        }
        res.status(200).json({ name: user.name, email: user.email });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid user ID' })
        }
        next(error)
    }
}

const saveUser = async (req, res, next) => {
    await body('name').trim().escape().run(req);
    await body('email').trim().escape().notEmpty().isEmail().normalizeEmail().run(req);
    await body('password').trim().notEmpty().isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            next({ code: 400, msg: 'Email already exists' });
        }

        user = new User({
            name,
            email,
            password,
        });

        user.password = encrypt(password)
        await user.save();

        res.status(201).json({ name: user.name, email: user.email });
    } catch (error) {
        next(error)
    }
};

const loginUser = async (req, res, next) => {
    await body('email').trim().escape().notEmpty().isEmail().normalizeEmail().run(req);
    await body('password').trim().notEmpty().isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user && compare(password, user.password)) {
            const token = jwt.generate({ id: user._id })
            res.status(200).json({ access_token: 'Bearer ' + token })
        }
        else {
            next({ code: 404, msg: 'Invalid email / password' })
        }
    } catch (error) {
        next(error)
    }
};

const updateUser = async (req, res, next) => {
    await body('name').trim().escape().run(req);
    await body('email').trim().escape().notEmpty().isEmail().normalizeEmail().run(req);
    await body('password').trim().notEmpty().isLength({ min: 6 }).run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        next({ code: 422, msg: errors.array() });
    }
    const { name, email } = req.body;
    let { password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user._id != req.user._id) {
            next({ code: 400, msg: 'Email already exists' });
        }
        const { id } = req.params;
        password = encrypt(password)
        const updatedUser = await User.findByIdAndUpdate(id, { name, email, password });
        if (!updateUser) {
            next({ code: 404, msg: 'User not found' });
        }
        console.log(updatedUser);
        res.status(200).json({ name: name, email: email });
    } catch (error) {
        if (error instanceof mongoose.CastError) {
            next({ code: 400, msg: 'Invalid user ID' })
        }
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            next({ code: 404, msg: 'User not found' });
        } else {
            res.status(200).json({ message: 'User deleted' });
        }
    } catch (error) {
        next(error);
    }
}


module.exports = { getUsers, getUserById, saveUser, loginUser, updateUser, deleteUser }
