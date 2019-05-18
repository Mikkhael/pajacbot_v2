module.exports = class Command
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
};
