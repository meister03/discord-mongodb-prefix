const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema({
  
  guildID: { type: String },
  prefix: { type: String},
  ban: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed /// Change the field name | add other Fields, do not forget the "," ;)
});

module.exports = mongoose.model('data', serverSchema);
