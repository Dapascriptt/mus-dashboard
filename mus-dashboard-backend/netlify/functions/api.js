const serverless = require('serverless-http');
const { createApp } = require('../../app');

const handlerApp = createApp();

module.exports.handler = serverless(handlerApp, {
  // basePath memastikan prefix bawaan Netlify Functions otomatis dibuang
  // sebelum masuk ke Express. Digabung dengan pathRewrite agar rute /api
  // selalu cocok meski ada variasi prefix.
  basePath: '/.netlify/functions/api',
  request: {
    pathRewrite: {
      '^/.netlify/functions/api': '/api',
    },
  },
});
