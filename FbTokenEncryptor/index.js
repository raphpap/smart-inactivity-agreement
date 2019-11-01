const CryptoJS = require("crypto-js");

const AES_KEY = process.env.AES_KEY;

const createRequest = (body, callback) => {

  const accessToken = body.data.accessToken || "";
  const encrypted = CryptoJS.AES.encrypt(accessToken, AES_KEY);

  callback({encrypted: encrypted.toString()});
};

exports.handler = (event, context, callback) => {
  console.log("event", event);

  createRequest(event, (data) => {
    console.log({
      statusCode: 200,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Headers": "Authorization"
      },
      isBase64Encoded: false
    });
  });
};

exports.handlerv2 = (event, context, callback) => {
  console.log("event", event);

  createRequest(JSON.parse(event.body), (data) => {
    console.log({
      statusCode: 200,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true, // Required for cookies, authorization headers with HTTPS
        "Access-Control-Allow-Headers": "Authorization"
      },
      isBase64Encoded: false
    });
  });
};

module.exports.createRequest = createRequest;
