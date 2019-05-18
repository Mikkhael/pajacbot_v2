class Query {
    constructor(commandName, argumentsList = [])
    {
        this.commandName = commandName;
        this.argumentsList = argumentsList;
    }
};

module.exports = Query;