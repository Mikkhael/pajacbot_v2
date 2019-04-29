
class MessageAction
{
    constructor(name, priority, triggerOptions, matcher, handler)
    {
        const defaultTriggerOptions = {
            allowBots: true
        }
        
        this.name = name;
        this.priority = priority;
        
        this.triggerOptions = Object.assign({}, defaultTriggerOptions, triggerOptions);
        this.matcher = matcher;
        this.handler = handler;
    }
    
    match(message)
    {
        // If option is set, don't handle messages from other bots
        if(!this.triggerOptions.allowBots)
        {
            if(message.author.bot)
            {
                return {matched: false};
            }
        }
        
        // Execute the given matcher function
        let matchResult = this.matcher(message);
        
        if(matchResult)
        {
            return {matched: true, precalculatedData: matchResult};
        }
        
        return {matched: false};
        
    }
    
    handle(message, precalculatedData)
    {
        return this.handler(message, precalculatedData);
    }
    
    
    static getMatchingActionAndPrecalculatedData(message)
    {
        // Iterate over all known actions
        for(let action of MessageAction.actionList)
        {
            let matchResult = action.match(message);
            if(matchResult.matched)
            {
                return {action, precalculatedData: matchResult.precalculatedData};
            }
        }
        return {};
    }
    
    static getHandlerForMessage(message)
    {
        let {action, precalculatedData} = MessageAction.getMatchingActionAndPrecalculatedData(message);
        if(action)
        {
            // If found an action, return a binded method that handles the message, to be executed at any time
            return action.handle.bind(action, message, precalculatedData);
        }
        // Else return a function that does nothing
        return function(){};
    }
    
};

MessageAction.actionList = [];

module.exports = MessageAction;
