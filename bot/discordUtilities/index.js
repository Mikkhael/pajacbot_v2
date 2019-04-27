const Discord = require("discord.js");

/// Message ///

Discord.Message.prototype.respondSimple = function(content)
{
    if(this.channel)
    {
        this.channel.send(content.toString());
    }
}

/// Guild ///

Discord.Guild.prototype.getPajacableMembers = function()
{
    return this.members.filter( member => {
        return member.isPajacable();
    });
}

Discord.Guild.prototype.getRandomPajacableMember = function()
{
    return this.getPajacableMembers().random();
}

/// Guild Member ///
Discord.GuildMember.prototype.isPajacable = function()
{
    return  !this.user.bot && // cannot be a bot
            this.user.presence && this.user.presence.status != "offline" // must be online
}