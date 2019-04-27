const loader = require("./loader");
const MessageAction = require("./messageAction");


var isLoaded = false;

if(!isLoaded)
{
    loader.loadAllActions(MessageAction.actionList);
    isLoaded = true;
}

function handleMessage(message){
    return Promise.resolve(MessageAction.getHandlerForMessage(message)).then(handler => {
        return handler();
    });
}

module.exports = {
    MessageAction,
    handleMessage
}