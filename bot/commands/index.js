const Query = require("./Query");
const Command = require("./Command");
const Prototype = require("./Prototype");

const loader = require("./loader");

function parseArguments(argumentsString)
{
    const nextArgRegExp = /^\s*(?:(["'])(|(?:[^\\]|\\.)*?)\1|(\S*?))(?:\s+(.*$)|$)/;
    let args = [], rest = (argumentsString || "").replace(/^\s+/, "");
    while(rest)
    {
        // execute regex
        let match = rest.match(nextArgRegExp);
        // add the parsed argument
        args.push((match[2] || match[3] || "").replace(/\\(["'\\])/g, "$1"));
        // prepare rest of the argumentsString
        rest = match[4];
    }
    return args;
}

function parseQuery(string = "")
{
    let [, commandName, argumentsString] = string.match(/(\S+)(.*)$/) || [];
    return new Query(commandName, parseArguments(argumentsString));
}

module.exports = {
    Query,
    Command,
    Prototype,
    parseArguments,
    parseQuery,
    loadAllCommands: loader.loadAllCommands,
    list: loader.commandsList,
    apiList: loader.commandsApiList
}