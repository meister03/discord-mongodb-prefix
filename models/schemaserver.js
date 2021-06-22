const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  guildID: { type: String },
  prefix: { type: String},
  ban: { type: Boolean},
});

module.exports = mongoose.model('data', serverSchema);
