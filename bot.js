const Discord   = require("discord.js");
const fs 		= require('fs');
const winston	= require("winston");
const Bot	= require("./botUtils.js");

Bot.enchanceDiscord();

const client    = new Discord.Client();
const PREFIX 	= "()";

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss'
		}),
		winston.format.errors({stack: true}),
		winston.format.printf(info => {
			return `[${info.timestamp}] ${info.level}: \t${info.stack || info.message}`;
		}),
	),
	transports: [
		new winston.transports.Console()
	]
});


const queryHandler = require("./queryHandler.js");

function handleOnMessage(message)
{
	queryHandler.getActionToHandle(message).then(action=>{
		action.execute(message, Bot);
		
	}).catch(err => {
		if(err instanceof queryHandler.InvalidQueryError)
		{
			
		}
		else
		{
			logger.error(err);
		}
	})
}


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
client.on("message", handleOnMessage);

logger.info("Bot loaded");
module.exports = {
	login: function(){
		client.login(process.env.TOKEN).then(() => logger.info("Bot logged in")).catch(err => logger.error("Error while logging: " + err.message));
	},
	logger
}