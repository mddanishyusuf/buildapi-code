const moment = require('moment');
const redisClient = require('../clients/redis');

module.exports = (req, res, next) => {
    const { authUser } = res.locals;
    const key = authUser.uid;

    redisClient.exists(key, (err, reply) => {
        if (err) {
            return res.status(500).send({ message: 'Redis not working...' });
        }

        let data = null;

        if (reply === 1) {
            redisClient.get(key, (err, result) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: 'Redis not working...' });
                }

                data = JSON.parse(result);
                checkRateLimits(data);
            });
        } else {
            const newData = {
                count: 1,
                startTime: moment(authUser.updated_date).unix(),
                username: key,
                reqLimits: authUser.reqLimits,
            };
            redisClient.set(key, JSON.stringify(newData), (err) => {
                if (err) {
                    return res
                        .status(500)
                        .send({ message: 'Redis not working...' });
                }

                data = newData;
                checkRateLimits(data);
            });
        }
    });

    function checkRateLimits(data) {
        const currentTime = moment().unix();
        const difference = (currentTime - data.startTime) / (60 * 60 * 24 * 30);

        if (difference < 1) {
            if (data.count > data.reqLimits) {
                return res.status(429).send({
                    error: 1,
                    code: 429,
                    info: 'API rate limits exceeded. Please contact mddanishyusuf@gmail.com to upgrade your account.',
                });
            }
            data.count++;
        } else {
            data.count = 1;
            data.startTime = currentTime;
        }
        res.locals.usage = data;

        redisClient.set(key, JSON.stringify(data), (err) => {
            if (err) {
                return res
                    .status(500)
                    .send({ message: 'Redis not working...' });
            }
            next();
        });
    }
};
