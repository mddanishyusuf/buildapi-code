const AWS = require('aws-sdk');

const spacesEndpoint = new AWS.Endpoint('sgp1.digitaloceanspaces.com');

const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.SPACES_KEY,
      secretAccessKey: process.env.SPACES_SECRET,
});

module.exports = s3;
