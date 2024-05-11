// app/controllers/userController.js
const { randomString } = require('../helpers/functions');
const User = require('../models/User');

const { responseList } = require('../errors/responseList');

exports.getUserProfile = async (req, res) => {
    const { uid } = req.headers;
    try {
        const user = await User.findOne({ uid });
        if (!user) return res.status(401).send(responseList(401));

        res.status(200).send({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProfile = async (req, res) => {
    const { uid, email } = req.body;
    try {
        const user = await User.findOne({ uid });
        if (user)
            return res
                .status(400)
                .send(responseList(400, 'User already registered'));

        const userObj = {
            uid,
            email,
            api_key: randomString(32, 'aA#'),
        };

        const newUser = new User(userObj);
        await newUser.save();
        res.status(200).send(responseList(200));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
