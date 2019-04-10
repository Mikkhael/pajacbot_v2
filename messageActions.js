function MessageActionError(actionName, data, critical = false)
{
    this.actionName = actionName;
    this.data = data;
    this.critical = critical
}

function MessageAction(priority, matcher, handler, name)
{
    this.name = name;
    this.matcher = matcher;
    this.handler = handler;
    this.priority = priority;
}

MessageAction.prototype.match = function(message)
{
    return this.matcher(message);
}
MessageAction.prototype.execute = function(message)
{
    return this.handler(message);
}
MessageAction.prototype.createExecutionError = function(data, critical)
{
    return new MessageActionError(this.name, data, critical);
}

// Later will convert to object of all 
const messageActionsData = {
    
    // Kto jest pajacem
    whoIsPajac: new MessageAction( 256,
        function(message)
        {
            const whoIsPajacRegEx =  /kto jest pajacem/i;
            return whoIsPajacRegEx.test(message);
        },
        
        function(message)
        {
            if(message.guild && message.guild.available)
            {
                let pajacableMembers = message.guild.getPajacableMembers();
                if(pajacableMembers.size > 0)
                {
                    let chosenPajac = pajacableMembers.random();
                    message.respondSimple(chosenPajac);
                }
                else
                {
                    return this.createExecutionError("no pajacable members avaiable");
                }
            }
            else
            {
                return this.createExecutionError("no guild avaiable");
            }
            
        }
    ),
}

// Converting data to an Array, sortet by priority
let messageActionsList = [];
for(let key in messageActionsData)
{
    messageActionsData[key].name = key;
    messageActionsList.push(messageActionsData[key]);
}
messageActionsList.sort((a, b) => a.priority < b.priority);

function getAction(message)
{
    for(let action of messageActionsList)
    {
        if(action.match(message))
        {
            return action;
        }
    }
    return undefined;
}

function executeAction(actionName, ...args)
{
    if(messageActionsData[actionName])
    {
        returnmessageActionsData[actionName].handler(...args);
        return true;
    }
    return false;
}

module.exports = {
    Action: MessageAction,
    ActionsData: messageActionsData,
    execute: executeAction,
    get: getAction
}