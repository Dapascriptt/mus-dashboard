const serverless = require('serverless-http');
const { createApp } = require('../../app');

const handlerApp = createApp();

module.exports.handler = serverless(handlerApp);
