const Discord   = require("discord.js");
const fs 		= require('fs');
const Bot		= require("./botUtils.js");

Bot.enchanceDiscord();

const client    = new Discord.Client();
const PREFIX 	= "()";

const logger = require("./logger.js");

const queryHandler = require("./queryHandler.js");
const actionHandler = require("./actionHandler.js");
const actionPerformer = require("./actionPerformer.js");

function handleOnMessage(message)
{
	queryHandler.handleSimpleQueryMessage(message).then(actions => {
		actionPerformer.performAllOutputActions(actions, Bot);
	})
	.catch(err => {
		if(err instanceof queryHandler.InvalidQueryError)
		{
			
		}
		else if(err instanceof actionHandler.ActionHandlerError)
		{
			
		}
		else
		{
			logger.error(err);
		}
	});
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
	}
}