const serverless = require('serverless-http');
const { createApp } = require('../../app');

const handlerApp = createApp();

module.exports.handler = serverless(handlerApp, {
  request: {
    // Pastikan path Netlify Functions (/.netlify/functions/api/...) dinormalkan
    // menjadi /api/... sehingga rute Express tetap cocok dan tidak 404.
    pathRewrite: {
      '^/.netlify/functions/api': '/api',
    },
  },
});
