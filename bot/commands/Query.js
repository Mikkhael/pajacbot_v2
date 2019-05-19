const {commandsList} = require("./loader");

class Query {
    constructor(commandName, argumentsList = [])
    {
        this.commandName = commandName;
        this.argumentsList = argumentsList;
    }
    
    execute(message, bot)
    {
        return new Promise((resolve, reject)=>{
            let command = commandsList[this.commandName];
            if(!command)
            {
                throw new Query.UnknownCommandError(this.commandName);
            }
            resolve(command.handle(this.argumentsList, message, bot));
        });
    }
};

Query.UnknownCommandError = class extends Error{
    constructor(commandName) {
        super(`Unknown command "${commandName}"`);
        this.name = "UnknownCommandError";
    }
};

module.exports = Query;