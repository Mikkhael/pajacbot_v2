class Command
{
    constructor(name, prototypes, handler, description = "", addictionalDescription = "")
    {
        this.name = name;
        this.prototypes = prototypes;
        this.handler = handler;
        this.description = description;
        this.addictionalDescription = addictionalDescription;
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
    
    getHelp(prototypeId)
    {
        let res = "";
        if(prototypeId || this.prototypes.length == 1)
        {
            prototypeId--;
            if(!this.prototypes[prototypeId])
            {
                prototypeId = 0;
            }
            
            res+= `\`${this.name} ${this.prototypes[prototypeId].getSignatureFormated()}\` \n\t${
                this.prototypes[prototypeId].description ? 
                    this.prototypes[prototypeId].getDescription() :
                    this.description + " " + this.addictionalDescription
            }\n-------------\n`;
            
            res += this.prototypes[prototypeId].argumentTemplate.getElementsDescriptionData().map(x => 
                `\`${x.label}\`\n\t${x.description}`
            ).join("\n");
            
            return res;
        }
        else
        {
            res += this.description + " " + this.addictionalDescription + "\n";
            for(let i=0; i<this.prototypes.length;i++)
            {
                res+= `**${i+1}.** \`${this.name} ${this.prototypes[i].getSignatureFormated()}\` \n\t\t${this.prototypes[i].getDescription()}\n`;
            }
            
            return res;
        }
    }
};

Command.InvalidParametersError = class extends Error {
    constructor(commandName)
    {
        super("Invalid parameters provided for command **" + commandName + "**");
        this.commandName = commandName;
    }
};

Command.ExecutionError = class extends Error {
    constructor(commandName, message, params = {})
    {
        super("Error occurred while executing command **" + commandName + "**: " + message);
        this.commandName = commandName;
        this.params = params;
    }
};

module.exports = Command;
