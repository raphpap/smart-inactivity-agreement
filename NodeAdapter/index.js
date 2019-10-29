const request = require("request");
const CryptoJS = require("crypto-js");

const AES_KEY = process.env.AES_KEY;

const createRequest = (body, callback) => {

  const clientId = body.data.clientId || "";
  const encryptedAccessToken = body.data.encryptedAccessToken || "";
  const jobRunID = body.id;
  
  const decrypted = CryptoJS.AES.decrypt(encryptedAccessToken, AES_KEY);
  const decryptedAccessToken = decrypted.toString(CryptoJS.enc.Utf8);
  
  const url = `https://graph.facebook.com/${clientId}/posts?access_token=${decryptedAccessToken}`;
  
  request(url, (error, response, body) => {
    if (error || response.statusCode >= 400 || body.error) {
      callback(response.statusCode, {
        jobRunID,
        error: body,
        statusCode: response.statusCode
      });
    } else {
      const latestStr = JSON.parse(body).data[0].created_time;
      const latest = new Date(latestStr);

      callback(response.statusCode, {
        jobRunID,
        data: {
          latest: latest.getTime().toString()
        },
        statusCode: response.statusCode
      });
    }
  });
};

exports.handler = (event, context, callback) => {
  console.log("event", event);

  createRequest(event, (statusCode, data) => {
    console.log({
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });

    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });
  });
};

exports.handlerv2 = (event, context, callback) => {
  console.log("event", event);

  createRequest(JSON.parse(event.body), (statusCode, data) => {
    console.log({
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });

    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });
  });
};

module.exports.createRequest = createRequest;