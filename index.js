const mongoose = require("mongoose");
const serverset = require("./models/schemaserver.js");

class mongoprefix {

static defaultprefix = `!`; //The default Prefix

static prefix = new Map();

/**
* Sets the default Prefix
* @param {string} [defaultpref] - The default Prefix
*/
static setDefaultPrefix(defaultpref){
  this.defaultprefix = (defaultpref || `!`);
  return this.defaultprefix;
}

/**
* Connects to the MongoDB Server
* @param {string} [dbUrl] - A valid mongo database URI.
*/
static async setURL(dbUrl) {
  if (!dbUrl) throw new TypeError("A database url was not provided.");
  return mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

/**
* @param {string} [guildId] - Discord guild id.
*/
 static async createGuild(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isguild = await serverset.findOne({guildID: guildId });
    if (isguild){
      this.prefix.set(guildId, { ///this saves the default prefix in a map
        guild: guildId,
        prefix: isguild.prefix
      });
      return isguild;
    }
    
    const newGuild = new serverset({
      guildID: guildId
    });
    await newGuild.save().catch(e => console.log(`Failed to create guild: ${e}`));

    this.prefix.set(guildId, { ///this saves the default prefix in a map
      guild: guildId,
      prefix: this.defaultprefix
    });
    return newGuild;
}

/**
* @param {string} [guildId] - Discord guild id.
*/
static async deleteGuild(guildId) {
  if (!guildId) throw new TypeError("A guild id was not provided.");
  const guild = await serverset.findOne({guildID: guildId });
  if (!guild) return false;
  await serverset.findOneAndDelete({guildID: guildId }).catch(e => console.log(`Failed to delete guild: ${e}`));
  return guild;
}

/**
* @param {string} [guildId] - Discord guild id.
* @param {prefix} [newprefix] - Amount of xp to append.
*/
static async changeprefix(guildId , newprefix) {
  if (!guildId) throw new TypeError("A guild id was not provided.");
  if (!newprefix) throw new TypeError("A newprefix was not provided.");

  const guild = await this.createGuild(guildId);
  guild.prefix = newprefix;
  await guild.save().catch(e => console.log(`Failed to save new prefix: ${e}`) );

  this.prefix.set(guildId, { 
      guild: guildId,
      prefix: newprefix
  });
  return guild;
}

/**
* @param {string} [guildId] - Discord guild id.
*/
static async fetch(guildId) {
  if (!guildId) throw new TypeError("A guild id was not provided.");
  
  if(this.prefix.has(guildId)) return this.prefix.get(guildId)

  const guild = await serverset.findOne({guildID: guildId});
  if(!guild){ 
      this.prefix.set(guildId, { 
        guild: guildId,
        prefix: this.defaultprefix
      });
      return {guild: guildId, prefix: this.defaultprefix};
  }

  this.prefix.set(guildId, { 
    guild: guildId,
    prefix: guild.prefix  
  });
  return this.prefix.get(guildId);   
}


static async fetchall() {
  var guilds = await serverset.find({}).sort([['guildID', 'descending']]).exec();
  return guilds;
}

/**
* Function for fetching Guild, which does not saves the prefix in the map;
* @param {string} [guildId] - Discord guild id.
*/
static async fetchGuild(guildId) {
    if (!guildId) throw new TypeError("A guild id was not provided.");
    const isguild = await serverset.findOne({guildID: guildId });
    if (isguild) return isguild;
    const newGuild = new serverset({
      guildID: guildId
    });
    await newGuild.save().catch(e => console.log(`Failed to create guild: ${e}`));
    return newGuild;
}

}
module.exports = mongoprefix;
