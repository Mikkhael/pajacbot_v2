const fs = require("fs");

const commandsList = {};

function loadAllCommands()
{    
    const listPath = __dirname + "/list/";
    
    let commandNames = fs.readdirSync(listPath);
    
    for(let name of commandNames)
    {
        let command = require(listPath + name).command;
        if(commandsList[command.name])
        {
            logger.warn("Command names collision while loading commands");
        }
        commandsList[command.name] = command;
    }
}

module.exports = {
    loadAllCommands,
    commandsList
}