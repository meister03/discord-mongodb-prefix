<p align="center"><a href="https://nodei.co/npm/discord-mongodb-prefix/"><img src="https://nodei.co/npm/discord-mongodb-prefix.png"></a></p>
<p align="center"><img src="https://img.shields.io/npm/v/discord-mongodb-prefix"> <img src="https://img.shields.io/github/repo-size/meister03/disord-mongodb-prefix"> <img src="https://img.shields.io/npm/l/discord-mongodb-prefix"> <img src="https://img.shields.io/github/contributors/discord-mongodb-prefix">  <a href="https://discord.gg/YTdNBHh"><img src="https://discordapp.com/api/guilds/697129454761410600/widget.png" alt="Discord server"/></a></p>

# Discord-Mongodb-Prefix
A lightweight managing package to save custom prefix in db. Intelligent saving ways to lower traffic up to 90%.

**If you need help feel free to join our <a href="https://discord.gg/YTdNBHh ">discord server</a>. We will provied you all help ☺**
# Download
You can download it from npm:
```cli
npm i discord-mongodb-prefix
npm i mongoose  // when u did not installed it
```

# Setting Up
First we include the module into the project (into your main bot file).
```js
const mongopref = require("discord-mongodb-prefix");
client.prefix = new Map();  // do not rename here something, or else Dx
```
After that, you have to provide a valid mongodb url and set the default prefix.
```js
mongopref.setURL("mongodb://..."); //builts a connection with the db
client.defaultprefix = "Your default Prefix" ; // save here your default prefix
```

# Fetching the Prefix

*Following examples assume that your `Discord.Client` is called `client`.*

```js
client.on("message", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;
  
  const fetchprefix = await mongopref.fetch(client, message.guild.id);
  console.log(fetchprefix.prefix) /// will log out the prefix
.........
```

*The Code below will split the given prefix from the message*
```js
if (!message.content.startsWith(fetchprefix.prefix)) return;
const args = message.content.slice(fetchprefix.prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();
```
# Change prefix

```js
if(command === "changeprefix"){ /// you can use your command handler to, but look that you overgive the parameters client, message
let newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
message.channel.send(`**Successfully change prefix from ${fetchprefix.prefix} to ${newprefix}**`)
}
```
# Whole code
```js
  
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
///////Add this
const mongopref = require("discord-mongodb-prefix");
client.prefix = new Map(); 

mongopref.setURL("mongodb://..."); //builts a connection with the db
client.defaultprefix = prefix ; // save here your default prefix
//// Add this

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', async message => {
    if (message.author.bot) return;
//add this
  const fetchprefix = await mongopref.fetch(client, message.guild.id);
  console.log(fetchprefix.prefix)
/// add this
if (!message.content.startsWith(fetchprefix.prefix)) return;
const args = message.content.slice(fetchprefix.prefix.length).trim().split(/ +/);
const command = args.shift().toLowerCase();

if(command === "changeprefix"){ /// you can use your command handler to, but look that you overgive the parameters client, message
let newprefix = args[0]; // the provided argument. Ex: !changeprefix <newprefix>
await mongopref.changeprefix(client, message.guild.id, newprefix); // this will save the new prefix in the map and in the db to prevent multipy fetches
message.channel.send(`**Successfully change prefix from "${fetchprefix.prefix}" to "${newprefix}"**`)
}
if(command === "prefix"){
  if(!args[0]) return message.channel.send(`This Servers prefix is ` +"`" + fetchprefix.prefix+ "`")
   const otherprefix = await mongopref.fetch(client, args[0]);
   return message.channel.send(`The Server(${args[0]}) prefix is` + " `" + otherprefix.prefix + " .`")
}
if(command === "prefixstats"){
var all = await mongopref.fetchall();
const stats = new Discord.MessageEmbed()
.setTitle("Prefix stats")
.addField("Prefix saved on Map:" , "```" + client.prefix.size + " prefix saved" + "```")
.addField("Different Prefix:","```" + Object.keys(all).length + " Servers have a another prefix"+ "```")
.addField("Servers with default prefix:" ,"```" + Number(client.guilds.cache.size-Object.keys(all).length) + " Servers are not saved in db"+ "```")
.setColor("YELLOW")
return message.channel.send(stats)
} 
});
client.login(token);
```

*Is time for you to use the code creative..*

# Methods
**createServer**

Creates an entry in database for that Server if it doesnt exist.
```js
mongopref.createGuild(client,message.guild.id); /// you can also give a another guild id
```
**deleteServer**

If the entry exists, it deletes it from database.
```js
mongopref.deleteGuild(message.guild.id); /// you can also give a another guild id
```
# For Advanced Coders
**This code will use the mention prefix of the bot or the custom prefix**
```js
  const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');   //// the bot will react to on mention prefix 
  //// and will check with a regex if the fetched prefix is on the message
	const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(fetchprefix.prefix)})\\s*`);
	if (!prefixRegex.test(message.content) || message.author.bot) return;    
	const [, matchedPrefix] = message.content.match(prefixRegex);  
	
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
```
**Have fun and feel free to contribute/suggest or contact me on my discord server or per dm on Meister#9667**

# Bugs, Glitches and Issues
If you encounter any problems fell free to open an issue in our <a href="https://github.com/meister03/discord-mongodb-prefix/issues">github repository or join the discord server.</a>.
