const mongoose = require('mongoose');
const { errorsList } = require('../errors/errorsList');

const User = mongoose.model('User');
const authChecker = async (req, res, next) => {
    try {
        const { api_key } = req.query;
        let user = await User.findOne({ api_key }).exec();

        if (user) {
            res.locals.authUser = user;
            next();
        } else {
            res.status(401).send(errorsList('401'));
        }
    } catch (error) {
        res.status(400).send(errorsList('400', error.message));
    }
};

module.exports = authChecker;
