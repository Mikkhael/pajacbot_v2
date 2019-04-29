const MessageAction = require("../../messageAction");
const dataManager   = require("../../../dataManager");

/*

Preset format:

<key>: {
    response: <string>
    url: <string>
    image: <string>
    isNonFormatable: <bool> (false)
}


*/

function getRawString(string)
{
    return string.replace(/[\.?!]*$/g, "").toLowerCase();
}

function getMatchingPresetFromDataManager(message)
{
    return dataManager.get(["presetResponses", getRawString(message.content.toString())], message.getGuildId(), message.getChannelId());
}

function getFormatedResponseForAPreset(messageContent, preset)
{
    let resultString = preset.response || "";
    
    // Check, if message is formatable
    if(resultString && !preset.isNonFormatable)
    {
        // If is all upercase, than make the result uppercase
        if(messageContent.toUpperCase() === messageContent)
        {
            resultString = resultString.toUpperCase();
        }
        
        // If ends with a "...", add "..." to the beginning
        if(/\.{2,}[?!]*$/.test(messageContent))
        {
            resultString = "..." + resultString;
        }
    }
    
    // Check, if it should be a RichEmbed message
    if(preset.url || preset.image)
    {
        return {
            type: "embed",
            value: {
                title: preset.response || preset.url,
                url: preset.url,
                image:{
                    url: preset.image
                }
            }
        };
    }
    
    // If not, return default simple message
    return {
        type: "simple",
        value: resultString
    }
    
}

function respondToAMessageWithGivenPreset(message, preset)
{
    let response = getFormatedResponseForAPreset(message.content, preset);
    switch (response.type) {
        case "simple": {
            return message.respondSimple(response.value);
            break;
        }
        case "embed": {
            return message.respondEmbed(response.value);
            break;
        }
    }
}

const messageAction = new MessageAction(
    "presetResponse",
    900,
    {
        allowBots: false
    },
    function(message){
        return getMatchingPresetFromDataManager(message);
    },
    function(message, preset){
        return respondToAMessageWithGivenPreset(message, preset);
    }
);


module.exports = {
    getRawString,
    getMatchingPresetFromDataManager,
    getFormatedResponseForAPreset,
    respondToAMessageWithGivenPreset,
    messageAction
}
