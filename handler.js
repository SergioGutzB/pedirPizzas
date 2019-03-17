'use strict';
const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');

var sqs = new AWS.SQS({ region: process.env.REGION });
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.hacerPedido = (event, context, callback) => {
  console.log('hacerPedido');
  const orderId = uuidv1();

  const params = {
    MessageBody: JSON.stringify({ orderId }),
    QueueUrl: QUEUE_URL
  };

  sqs.sendMessage(params, function (err, data) {
    if (err) {
      sendResponse(500, err, callback);
    } else {
      const message = {
        orderId,
        messageId: data.MessageId
      };
      sendResponse(200, message, callback);
    }
  });

};

function sendResponse(statusCode, message, callback) {
  const response = {
    statusCode: 200,
    body: JSON.stringify(message)
  };
  callback(null, response);
};