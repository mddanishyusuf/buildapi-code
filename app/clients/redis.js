const redis = require("redis");

const redisCl = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redisCl.on("error", (err) => {
  console.log("Redis Error " + err);
});

module.exports = redisCl;
