const actionPaths = [
    "./actions/whoispajac"
];

function loadAllActions(targetList)
{
    if(!Array.isArray(targetList)){
        throw new TypeError("target list should be an array");
    }
    
    for(let path of actionPaths)
    {
        let messageAction = require(path).messageAction;
        targetList.push(messageAction);
    }
}

module.exports = {
    loadAllActions,
    actionPaths
}