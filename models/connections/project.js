const mongoose = require('mongoose');

const conn = mongoose.createConnection(process.env.MONGO_URL_PROJECT);

conn.model('Project',require('../project.model'))

module.exports = conn;