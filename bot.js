const Discord   = require("discord.js");
const fs 		= require('fs');
const winston	= require("winston");


const client    = new Discord.Client();
const PREFIX 	= "()";

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.printf(info => {
			return `[${info.timestamp}] ${info.level}: \t${info.message}`;
		}),
	),
	transports: [
		new winston.transports.Console()
	]
});

client.on("message", (message) => {

    //Check if author is a bot
    if (message.author.bot){
        return;
	}
	
	// Check, if message is an image
	if(message.attachments && message.attachments.array().length > 0){
		return;
	}
	
	// Check, if message has any content (elsewise it would crash)
	if(message.content){
		
		if(message.content == "ping")
		{
			if(message.channel && message.channel.send)
			{
				message.channel.send("pong").catch(err => logger.info(err));
			}
		}
		
	}
    
});

// Time Interval for connectivity state logging
let interval;

client.on("ready", () => {

	logger.info("Ready");
	
	if(interval){
		clearInterval(interval);
		logger.info("Cleared Logging Interval");
	}
	interval = setInterval(function(){
		if(!client){
			logger.info("No client");
		}
		else{
			logger.info(client.user ? ("User presence status: " + (client.user.presence && client.user.presence.status)) : "No user is assosiated with the discord.js client");
		}
	}, 1000 * 60 * 60);
});

client.on("disconnect", () => {
	logger.info("Disconnected")
});
client.on("reconnecting", () => {
	logger.info("Reconnecting")
});
client.on("resume", () => {
	logger.info("Resume")
});
client.on("error", (error) => {
	logger.info(error.message);
});


logger.info("Bot loaded");
module.exports = {
	login: function(){
		client.login(process.env.TOKEN).then(() => logger.info("Bot logged in")).catch(err => logger.error("Error while logging: " + err.message));
	},
	logger
}