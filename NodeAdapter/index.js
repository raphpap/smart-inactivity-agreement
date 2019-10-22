const request = require("request");

const CLIENT_ID = process.env.CLIENT_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const url = `https://graph.facebook.com/${CLIENT_ID}/posts?access_token=${ACCESS_TOKEN}`;

const createRequest = (input, callback) => {
  request(url, (error, response, body) => {
    if (error || response.statusCode >= 400 || body.error) {
      callback(response.statusCode, {
        jobRunID: input.id,
        error: body,
        statusCode: response.statusCode
      });
    } else {
      callback(response.statusCode, {
        jobRunID: input.id,
        data: {latest: JSON.parse(body).data[0].created_time},
        statusCode: response.statusCode
      });
    }
  });
};

exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

module.exports.createRequest = createRequest;
