require('dotenv').config();
const { createApp } = require('./app');

const app = createApp();

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
