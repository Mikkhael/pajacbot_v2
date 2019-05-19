let commands = require("../../commands");
let logger = require("../../../logger");

const command = new commands.Command(
    "ping",
    [
        new commands.Prototype("default", new commands.Prototype.ArgumentTemplate(
            [
                []
            ]
        ))
    ],
    function(matchedPrototype, args, message, bot)
    {
        message.respondSimple("pong").catch(err => {
            logger.error(err);
        });
        return true;
    },
    "Responds with \"pong\". Used to measure latency from client to server"
);

module.exports = {
    command
};