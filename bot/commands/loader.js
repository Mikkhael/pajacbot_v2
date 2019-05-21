const fs = require("fs");

const commandsList = {};
const commandsApiList = {};

function loadAllCommands()
{    
    const listPath = __dirname + "/list/";
    
    let commandNames = fs.readdirSync(listPath);
    
    for(let name of commandNames)
    {
        let command = require(listPath + name);
        if(commandsList[command.name])
        {
            logger.warn("Command names collision while loading commands");
        }
        commandsApiList[command.command.name] = command;
        commandsList[command.command.name] = command.command;
    }
}

module.exports = {
    loadAllCommands,
    commandsList,
    commandsApiList
}