// Requires
const Discord       = require("discord.js");
const logger        = require("../logger");
const dataManager   = require("./dataManager");
const actionManager = require("./actionManager");


// Enable discord utilities
require("./discordUtilities");

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
    
    
    // Don't handle messages from yourself
    if(message.author.id === client.user.id)
    {
        return;
    }
    
    // Else, handle the message
    actionManager.handleMessage(message)
    .catch( err => {
        logger.error(err);
    });
    
});


// Logging and Sturtup

function login()
{
    return new Promise((resolve, reject) => {
        
        logger.info("Attempting loggin...");
        
        // Check if login token is loaded
        if(!process.env.TOKEN)
        {
            logger.info("Unable to login. Token not provided.");
            reject(new Error("Token is required to login, but not provided"));
        }
        else
        {
            // Try logging
            client.login(process.env.TOKEN)
            .then(()=>{
                logger.info("Logged in successfully.");
                resolve();
            })
            .catch(error => {
                logger.info("Unable to login.");
                reject(error);
            });
        }
    });
}

function loadData()
{
    
    return new Promise((resolve, reject) => {
        
        logger.info("Attempting loading data...");
        
        // Try loading data
        dataManager.load()
        .then(()=>{
            logger.info("Data loaded successfully.")
            dataManager.validate();
            
            // Enable autosave
            dataManager.enableAutosave(10 * 1000, function(error){
                // Callback, if autosave fails
                if(error instanceof Error)
                {
                    logger.info("Unable to autosave file", error);
                }
            });
            resolve();
        })
        // In case of impossibility to load correctly
        .catch(error =>{
            logger.warn("Unable to load data file", error.message);
            
            logger.info("Creating a new data file...");
            
            dataManager.validate();
            dataManager.save()
            .then(()=>{
                logger.info("Created new default data file successfully.");
                resolve();
            })
            .catch(error =>{
                logger.error("Unable to create new data file");
                reject(error);
            });
        });
        
    });
}

function startupRoutine()
{
    loadData().then(login).then(()=>{
        logger.info("--- Bot fully operational ---");
    })
    .catch(error =>
    {
        logger.error(error);
    });
}


module.exports = {
    start: startupRoutine
}