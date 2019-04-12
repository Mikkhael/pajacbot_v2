const Discord = require("discord.js");
const messageActions = require("./actionHandler.js");


function InvalidQueryError(data)
{
    this.data = data;
}

function getInputFromSimpleMessage(message)
{
    return new Promise((resolve, reject) => {
        
        //Check if it's an instance of Discord.Message
        if(!(message instanceof Discord.Message))
        {
            reject(new InvalidQueryError("notAMessage"));
            return;
        }
        
        //Check if author is a bot
        if (message.author.bot){
            reject(new InvalidQueryError("bot"));
            return;
        }
        
        // Check, if message is an image
        if(message.attachments.array().length > 0){
            reject(new InvalidQueryError("attachment"));
            return;
        }
        
        // Check, if message has any content (elsewise it would crash)
        if(!message.content){
            reject(new InvalidQueryError("noContent"));
            return;
        }
        
        resolve(messageActions.InputAction.createFromSimpleMessage(message));
    });
}

function handleInputAction(input)
{
    return messageActions.handleInput(input);
}

function handleSimpleQueryMessage(message)
{
    return getInputFromSimpleMessage(message).then(handleInputAction);
}

    
module.exports = {
    InvalidQueryError,
    handleSimpleQueryMessage,
    handleInputAction
}