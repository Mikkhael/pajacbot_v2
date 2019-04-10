const Discord = require("discord.js");
const messageActions = require("./messageActions.js");


function InvalidQueryError(data)
{
    this.data = data;
}

function checkIfMessageIsAQuery(message)
{
    return new Promise((resolve, reject) => {
        
        //Check if it's an instance of Discord.Message
        if(!(message instanceof Discord.Message))
        {
            reject(new InvalidQueryError("notAMessage"));
        }
        
        //Check if author is a bot
        if (message.author.bot){
            reject(new InvalidQueryError("bot"));
        }
        
        // Check, if message is an image
        if(message.attachments.array().length > 0){
            reject(new InvalidQueryError("attachment"));
        }
        
        // Check, if message has any content (elsewise it would crash)
        if(!message.content){
            reject(new InvalidQueryError("noContent"));
        }
        
        resolve(message);
    });
}

function getActionToHandle(message)
{
    return checkIfMessageIsAQuery(message).then(handleQueryMessage);
}

function handleQueryMessage(message) {
    return new Promise(function(resolve, reject){
        
        let action = messageActions.get(message);
        if(action)
        {
            resolve(action);
        }
        else
        {
            reject(new InvalidQueryError("noAction"));
        }
    });
}
    
module.exports = {
    InvalidQueryError,
    getActionToHandle
}