const { errorsList } = require('../errors/errorsList');
const redisClient = require('../clients/redis');
const moment = require('moment');

const trackApi = async (req, res, next) => {
    try {
        const key = 'tracking-apis';
        const origin = req.headers.origin || 'in-browser';

        redisClient.exists(key, (err, reply) => {
            if (err) {
                res.status(500).send({ message: 'Redis not working...' });
            }
            if (reply === 1) {
                // user exists
                // check time interval
                redisClient.get(key, (err, result) => {
                    const data = JSON.parse(result);
                    data.count += 1;
                    console.log(origin);

                    if (data[origin] === undefined) data[origin] = {};

                    if (data[origin][moment().format('YYYY-MM-DD')]) {
                        data[origin][
                            String(moment().format('YYYY-MM-DD'))
                        ] += 1;
                    } else {
                        data[origin][moment().format('YYYY-MM-DD')] = 1;
                    }

                    redisClient.set(key, JSON.stringify(data));
                    // allow request
                    next();
                });
            } else {
                const data = {
                    count: 1,
                };

                data[origin] = {};

                data[origin][moment().format('YYYY-MM-DD')] = 1;

                redisClient.set(key, JSON.stringify(data));
                // allow request
                next();
            }
        });
    } catch (error) {
        res.status(400).send(errorsList('400', error.message));
    }
};

module.exports = trackApi;
