const Discord = require("discord.js");


function enchanceDiscord()
{
    // Channel
    Discord.Channel.prototype.respondSimple = function(messageContent)
    {
        this.send(messageContent.toString())
    }
    
    // Messages
    Discord.Message.prototype.respondSimple = function(messageContent)
    {
        this.channel.respondSimple(messageContent);
    }
    
    // Members
    Discord.GuildMember.prototype.isPajacable = function()
    {
        return !this.user.bot && this.presence.status !== "offline";
    }
    
    // Guilds
    Discord.Guild.prototype.getPajacableMembers = function()
    {
        return this.members.filter(member => member.isPajacable());
    }
}


module.exports = {
    enchanceDiscord
}