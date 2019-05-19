let commands = require("../../commands");
let logger = require("../../../logger");

const command = new commands.Command(
    "echo",
    [
        new commands.Prototype("default", new commands.Prototype.ArgumentTemplate(
            [
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("message", "A message to respond with")
                ]
            ]
        ))
    ],
    function(matchedPrototype, args, message, bot)
    {
        if(args.message)
        {
            message.respondSimple(args.message).catch(err => {
                logger.error(err);
            });
        }
        return true;
    },
    "Makes the bot say provided *message*. Remember to encapsulate the message in quotes if it contains whitespaces."
);

module.exports = {
    command
};