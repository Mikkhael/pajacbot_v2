const fs = require("fs");

function loadAllActions(targetList)
{
    if(!Array.isArray(targetList)){
        throw new TypeError("target list should be an array");
    }
    
    const actionPath = __dirname + "/actions/";
    
    let actionNames = fs.readdirSync(actionPath);
    
    for(let name of actionNames)
    {
        let messageAction = require(actionPath + name).messageAction;
        targetList.push(messageAction);
    }
    
    targetList.sort((a, b) => a.priority < b.priority);
}

module.exports = {
    loadAllActions
}