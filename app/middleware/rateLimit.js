const mongoose = require('mongoose');
const User = mongoose.model('User');
const Form = mongoose.model('Form');

const redisClient = require('../clients/redis');
const moment = require('moment');
const { errorsList } = require('../errors/errorsList');

module.exports = async function (req, res, next) {
    const formId = req.params.formId;
    const form = await Form.findOne({ formSlug: formId }).exec();

    const user = await User.findOne({ _id: form.createdBy }).exec();
    const userId = user.uid;
    const planName = user.planName;
    const reqLimits = user.totalResponses;

    const key = `limit:${userId}`;

    if (planName === 'Lifetime') {
        next();
    } else {
        redisClient.get(key, async (err, result) => {
            if (err) {
                return res.status(500).json(errorsList(500, err.message));
            }

            const currentTime = moment().unix();
            const data = result
                ? JSON.parse(result)
                : {
                      count: 0,
                      startTime: currentTime,
                      reqLimits,
                      countObject: {},
                  };

            const difference =
                (currentTime - data.startTime) / (60 * 60 * 24 * 30);

            if (difference >= 1) {
                data.count = 1;
                data.startTime = moment().unix();
                data.countObject = {};
            } else if (data.count >= reqLimits) {
                return res.status(400).json(errorsList(429));
            } else {
                data.count += 1;
            }

            try {
                await redisClient.set(key, JSON.stringify(data));
                next();
            } catch (err) {
                res.status(500).json(errorsList(500, err.message));
            }
        });
    }
};
