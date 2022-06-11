module.exports = {
    conf: {
        aliases: ["nuke"],
        name: "Nuke",
        help: "Nuke",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        let channel = message.mentions.channels.first() || message.channel;
        message.channel.send(`${channel.name} adlı kanal temizleniyor...`);
        let position = channel.position;
        setTimeout(() => {
        channel.delete();
        channel.clone({
        name: channel.name,
        permissionOverwrites: channel.permissionOverwrites, 
        type: channel.type, 
        topic: channel.topic, 
        nsfw: channel.nsfw, 
        bitrate: channel.bitrate, 
        userLimit: channel.userLimit, 
        rateLimitPerUser: channel.rateLimitPerUser, 
        parent: channel.parent, 
        reason: 'purged'
        }).then(s => {
        s.setPosition(position);    
        });
        }, 180)
        
    },
};