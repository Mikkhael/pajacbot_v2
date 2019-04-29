const Discord = require("discord.js");

/// Message ///

Discord.Message.prototype.respondSimple = function(content)
{
    if(this.channel)
    {
        return this.channel.send(content.toString());
    }
    return Promise.reject(new Error("No channel to send to"));
}
Discord.Message.prototype.respondEmbed = function(embed)
{
    if(this.channel)
    {
        return this.channel.send({embed});
    }
    return Promise.reject(new Error("No channel to send to"));
}

Discord.Message.prototype.getGuildId = function()
{
    if(this.guild && this.guild.available)
    {
        return this.guild.id;
    }
    return undefined;
}
Discord.Message.prototype.getChannelId = function()
{
    if(this.channel)
    {
        return this.channel.id;
    }
    return undefined;
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