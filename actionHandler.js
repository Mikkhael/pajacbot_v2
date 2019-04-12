function ActionHandlerError(actionName, data, critical = false)
{
    this.actionName = actionName;
    this.data = data;
    this.critical = critical
}

function InputAction(type, data)
{
    this.type = type;
    this.data = data;
}

InputAction.createFromSimpleMessage = function(message)
{
    return new InputAction("message", {message});
}

function OutputAction(type, data)
{
    this.type = type;
    this.data = data;
}

OutputAction.createSimpleResponseMessage = function(inputMessage, responseMessageContent)
{
    return new OutputAction("simpleResponseMessage", {inputMessage, responseMessageContent});
}

function ActionHandler(priority, machableInputTypes, matcher, handler, name = "")
{
    this.name = name;
    this.machableInputTypes = machableInputTypes;
    this.matcher = matcher;
    this.handler = handler;
    this.priority = priority;
}

ActionHandler.prototype.match = function(input)
{
    if(this.machableInputTypes.some(x => x == input.type))
    {
        return this.matcher(input);
    }
    return false;
}

ActionHandler.prototype.handle = function(input)
{
    return Promise.resolve(this.handler(input));
}

ActionHandler.prototype.createHandlerError = function(data, critical)
{
    return new ActionHandlerError(this.name, data, critical);
}

ActionHandler.prototype.None = function()
{
    return new ActionHandler(0, [], ()=>true, () => [], "none");
}

// Later will convert to object of all 
const actionHandlers = {
    
    // Kto jest pajacem
    whoIsPajac: new ActionHandler( 256, ["message"],
        function(input)
        {
            const whoIsPajacRegEx =  /kto jest pajacem/i;
            return whoIsPajacRegEx.test(input.data.message.content);
        },
        
        function(input)
        {
            let message = input.data.message;
            if(message.guild && message.guild.available)
            {
                let pajacableMembers = message.guild.getPajacableMembers();
                if(pajacableMembers.size > 0)
                {
                    let chosenPajac = pajacableMembers.random();
                    return [OutputAction.createSimpleResponseMessage(message, chosenPajac)];
                }
                else
                {
                    throw this.createHandlerError("no pajacable members avaiable");
                }
            }
            else
            {
                throw this.createHandlerError("no guild avaiable");
            }
        }
    ),
}

// Converting data to an Array, sortet by priority
let actionHandlersList = [];
for(let key in actionHandlers)
{
    actionHandlers[key].name = key;
    actionHandlersList.push(actionHandlers[key]);
}
actionHandlersList.sort((a, b) => a.priority < b.priority);

function getAction(input)
{
    return actionHandlersList.find(action => action.match(input)) || ActionHandler.prototype.None();
}

function handleInput(input)
{
    return getAction(input).handle(input);
}

module.exports = {
    ActionHandler,
    ActionHandlerError,
    OutputAction,
    InputAction, 
    getAction,
    handleInput
}