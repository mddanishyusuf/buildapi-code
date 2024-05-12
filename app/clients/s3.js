const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
});

module.exports = s3;
