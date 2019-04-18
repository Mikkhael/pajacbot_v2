// Requires
const Discord       = require("discord.js");
const logger        = require("../logger");


// Creating the Discord Client
const client = new Discord.Client();


// Discord Client handling with logging
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
	logger.error(error);
});


// Message event handling
client.on("message", message => {
    
    if(message.author.bot)
    {
        return;
    }
    
    message.channel.send("Tak");
    
});


// Loging
function login()
{
    logger.info("Attempting loggin...");
    
    // Check if login token is loaded
    if(!process.env.TOKEN)
    {
        logger.error("TOKEN is not loaded. Unable to login");
        return;
    }
    
    // Try logging
    client.login(process.env.TOKEN)
    .then(()=>{
        logger.info("Bot logged in successfully");
    })
    .catch( error => {
        logger.error("Unable to login");
    });
}


module.exports = {
    login
}