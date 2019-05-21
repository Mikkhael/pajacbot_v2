let commands = require("../../commands");
let logger = require("../../../logger");

const {commandsList} = require("../loader");

function sendFullHelp(channel)
{
    let res = "List of all supported commands:\n\n";
    for(let commandName in commandsList)
    {
        res += `**${commandName}**\n\`${commandsList[commandName].description}\`\n`;
    }
    res += "\nUse `help <commandName>` for more info about each command.";
    
    return channel.send(res).catch(err => {
        logger.error(err);
    });
}

function sendCommandHelp(commandName, channel)
{
    let command = commandsList[commandName];
    if(command)
    {
        return channel.send("Usage of command **" + commandName + "**:\n\n" + command.getHelp()).catch(err => {
            logger.error(err);
        });
    }
    return channel.send("No command of name **"+ commandName +"** exists.").catch(err => {
        logger.error(err);
    });
}

function sendPrototypeHelp(commandName, prototypeId, channel)
{
    let command = commandsList[commandName];
    if(command)
    {
        return channel.send("Usage of command **" + commandName + "**:\n\n" + command.getHelp(prototypeId)).catch(err => {
            logger.error(err);
        });
    }
    return channel.send("No command of name **"+ commandName +"** exists.").catch(err => {
        logger.error(err);
    });
}

const command = new commands.Command(
    "help",
    [
        new commands.Prototype("default", new commands.Prototype.ArgumentTemplate(
            [
                [],
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("commandName", "Name of the command to get the usage help of. If none provided, the list of possible commands is shown.")
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Natural("commandVersion", "Verion of the command syntax to get help of. Has no effect, if only one version exists")
                ]
            ]
        ))
    ],
    function(matchedPrototype, args, message, bot)
    {
        if(args.commandName)
        {
            if(args.commandVersion)
            {
                sendPrototypeHelp(args.commandName, args.commandVersion, message.channel);
            }
            else
            {
                sendCommandHelp(args.commandName, message.channel);
            }
            return true;
        }
        
        sendFullHelp(message.channel);
        
        return true;
    },
    "Shows help for the usage of the bot."
);

module.exports = {
    command,
    sendCommandHelp,
    sendFullHelp,
    sendPrototypeHelp
};