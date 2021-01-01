const mongoose = require("mongoose");
const serverset = require("./models/schemaserver.js");

class mongoprefix {

  /**
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
  * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
  * @param {string} [guildId] - Discord guild id.
  */

  static async createGuild(client, guildId) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");

    const isguild = await serverset.findOne({guildID: guildId });
    if (isUser) return false;

    const newGuild = new serverset({
      guildID: guildId
    });

    await newGuild.save().catch(e => console.log(`Failed to create guild: ${e}`));
    client.prefix.set(guildId, { ///this saves the default prefix in a map
      guild: guildId,
      prefix: client.defaultprefix
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
  * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
  * @param {string} [guildId] - Discord guild id.
  * @param {prefix} [newprefix] - Amount of xp to append.
  */

  static async changeprefix(client, guildId , newprefix) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if (!newprefix) throw new TypeError("A newprefix was not provided.");

    const guild = await serverset.findOne({guildID: guildId });

    if (!guild) {
      const newGuild = new serverset({
        guildID: guildId,
        prefix: newprefix,
       });

      await newGuild.save().catch(e => console.log(`Failed to save new Guild.`));
     client.prefix.set(guildId, { ///this saves the default prefix in a map
        guild: guildId,
        prefix: newprefix
      });
      return;
    };

   
    guild.prefix = newprefix;

    await guild.save().catch(e => console.log(`Failed to save new prefix: ${e}`) );
    client.prefix.set(guildId, { ///this saves the default prefix in a map
      guild: guildId,
      prefix: newprefix
    });
    return;
  }

  /**
  * @param {object} [client] - Discord client, will save the data in a Map to prevent multiple fetches
  * @param {string} [guildId] - Discord guild id.
  */

  static async fetch(client, guildId) {
    if (!client) throw new TypeError("An client was not provided.");
    if (!guildId) throw new TypeError("A guild id was not provided.");
    if(!client.prefix.has(guildId)){
      const guild = await serverset.findOne({guildID: guildId });

      if(!guild){ // checks if the guild exist, when not it will assign in the map the default prefix
        client.prefix.set(guildId, { ///this saves the default prefix in a map
          guild: guildId,
          prefix: client.defaultprefix
        });
      return client.prefix.get(guildId);
      }

      client.prefix.set(guildId, { ///this save the custom prefix in a map
        guild: guildId,
        prefix: guild.prefix  /// assigns the custom prefix
      });
      return client.prefix.get(guildId);   /// returns the value
    }else{ //when a value is already assigned in the map.It will return the value.
      return client.prefix.get(guildId);  
    }
  }

 static async fetchall() {
   var guilds = await serverset.find({}).sort([['guildID', 'descending']]).exec();
  return guilds;
  }

}

module.exports = mongoprefix;
