const MessageAction = require("../../messageAction");


function getPajacInAChannel(channel)
{
    return channel.guild.getRandomPajacableMember();
}

const messageAction = new MessageAction(
    "whoIsPajac",
    1000,
    {},
    function(message){
        const whoIsPajacRegExp = /kto\s*jest\s*pajacem/i;
        return  message.guild &&
                message.guild.available &&
                message.channel &&
                message.content &&
                whoIsPajacRegExp.test(message.content);
    },
    function(message){
        message.respondSimple(getPajacInAChannel(message.channel));
    }
);


module.exports = {
    getPajacInAChannel,
    messageAction
}
