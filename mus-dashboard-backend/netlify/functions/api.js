// mus-dashboard-backend/netlify/functions/api.js
const serverless = require('serverless-http');
const { createApp } = require('../../app');

// buat instance express
const app = createApp();

// Netlify akan memanggil: /.netlify/functions/api/...
// pathRewrite dipakai supaya Express tetap pakai prefix /api
module.exports.handler = serverless(app, {
  request: {
    pathRewrite: {
      '^/.netlify/functions/api': '/api',
    },
  },
});
