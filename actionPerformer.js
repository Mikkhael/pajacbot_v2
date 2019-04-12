const Discord = require("discord.js");

function performOuptutAction(action, bot)
{
    switch(action.type)
    {
        case "simpleResponseMessage":
        {
            action.data.inputMessage.channel.send(action.data.responseMessageContent.toString());
            break;
        }
    }
}

function performAllOutputActions(actions, bot)
{
    actions.forEach(action => {
        performOuptutAction(action, bot);
    });
}

module.exports = {
    performOuptutAction,
    performAllOutputActions
}