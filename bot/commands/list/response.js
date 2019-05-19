let commands = require("../../commands");
let logger = require("../../../logger");

const command = new commands.Command(
    "response",
    [
        new commands.Prototype("set", new commands.Prototype.ArgumentTemplate(
            [
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("set", ["set"], "Set the flag, to set a new response."),
                    new commands.Prototype.ArgumentTemplate.Element.String("query", "The message, that will triger the response"),
                    new commands.Prototype.ArgumentTemplate.Element.String("response", "The text message, that the bot will respond with. Can be empty, if you specify either url or the image."),
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("url", "The url, that the response will link to. Set es empty (\"\"), if you want none"),
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("imageUrl", "The url of the image, that will be sent together with the response. Set es empty (\"\"), if you want none"),
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("scope", ["global", "server", "channel"], "The scope from which the message will be triggered. Global by default")
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("noFormat", ["noFormat"], "Set the flag, to prevet formatting the response text message.")
                ]
            ]
        ), "Adds or Overwrites a preset response."),
        new commands.Prototype("delete", new commands.Prototype.ArgumentTemplate(
            [
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("delete", ["delete"], "Set the flag, to delete the specified response."),
                    new commands.Prototype.ArgumentTemplate.Element.String("query", "The message, that triggers the response you want to delete"),
                    new commands.Prototype.ArgumentTemplate.Element.Enum("scope", ["global", "server", "channel"], "The scope from which the response will be deleted")
                ]
            ]
        ), "Deletes a preset response.")
    ],
    function(matchedPrototype, args, message, bot)
    {
        args.query = args.query ? args.query.trim().toLowerCase() : "";
        switch(matchedPrototype)
        {
            case "set":{
                let res = {};
                
                args.response = args.response ? args.response.trim() : "";
                args.url = args.url ? args.url.trim() : "";
                args.imageUrl = args.imageUrl ? args.imageUrl.trim() : "";
                args.scope = args.scope || "global";
                
                res.response = args.response || undefined;
                res.url = args.url || undefined;
                res.image = args.imageUrl || undefined;
                res.isNonFormatable = args.noFormat || undefined;
                
                if(!res.response && !res.url && !res.image)
                {
                    throw new commands.Command.ExecutionError("response", "You have to specify at least the response text message", {matchedPrototype});
                }
                if(!args.query)
                {
                    throw new commands.Command.ExecutionError("response", "You have to specify a valid query", {matchedPrototype});
                }
                
                bot.dataManager.setInScope(["presetResponses", args.query], res, args.scope, args.scope === "channel" ? message.getChannelId() : message.getGuildId());
                message.respondSimple(`Set a response:\n\t**query**: ${args.query}\n\t**response**: ${args.response}\n\t**url**: ${args.url}\n\t**image**: ${args.imageUrl}\n\t**scope**: ${args.scope}\n\t**prevent formatting**: ${args.noFormat ? "Yes" : "No"}`);
                return true;
            }
            case "delete":{
                bot.dataManager.setInScope(["presetResponses", args.query], undefined, args.scope, args.scope === "channel" ? message.getChannelId() : message.getGuildId());
                message.respondSimple(`Deleted a response:\n\t**query**: ${args.query}\n\t**scope**: ${args.scope}`);
                return true;
            }
        }
        return false;
    },
    "Add or Delete the response triggered by specified message. It is possible to set the hyperlink and an image together with the message."
);

module.exports = {
    command
};