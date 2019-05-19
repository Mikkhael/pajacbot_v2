class Command
{
    constructor(name, prototypes, handler, description = "")
    {
        this.name = name;
        this.prototypes = prototypes;
        this.handler = handler;
        this.description = description;
    }
    
    getParsedArguments(argumentList)
    {
        let parsed = null;
        for(let prototype of this.prototypes)
        {
            if(parsed = prototype.getParsedArguments(argumentList))
            {
                break;
            }
        }
        return parsed;
    }
    
    handle(argumentList, message, bot)
    {
        let parsed = this.getParsedArguments(argumentList);
        if(parsed)
        {
            return this.handler(parsed.matchedPrototype, parsed.parsedArguments, message, bot);
        }
        throw new Command.InvalidParametersError(this.name);
    }
};

Command.InvalidParametersError = class extends Error {
    constructor(commandName)
    {
        super("Invalid parameters provided for command " + commandName);
        this.commandName = commandName;
    }
};

Command.ExecutionError = class extends Error {
    constructor(commandName, message, params = {})
    {
        super("Error occurred while executing command " + commandName + ": " + message);
        this.commandName = commandName;
        this.params = params;
    }
};

module.exports = Command;
