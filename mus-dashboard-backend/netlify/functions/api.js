const serverless = require('serverless-http');
const { createApp } = require('../../app');

const handlerApp = createApp();

// Netlify akan memanggil Function dengan path
// "/.netlify/functions/api/<route>". Kita rewrite prefix tersebut ke
// "/api" agar rute Express cocok tanpa menambah basePath lain yang bisa
// mengakibatkan path menjadi ganda dan berujung 404.
module.exports.handler = serverless(handlerApp, {
  request: {
    pathRewrite: {
      '^/.netlify/functions/api': '/api',
    },
  },
});
