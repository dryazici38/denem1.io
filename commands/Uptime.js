const conf = require("../configs/settings.json")
const emojis = require("../configs/emoji.json")
module.exports = {
    conf: {
        aliases: ["uptime"],
        name: "Uptime",
        help: "uptime",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        if(!conf.owners.includes(message.member.id)) return message.react(emojis.mark);
        const uptime = {
            gün: Math.floor(client.uptime / 86400000),
            saat: Math.floor(client.uptime / 3600000) % 24,
            dakika: Math.floor(client.uptime / 60000) % 60,
            saniye: Math.floor(client.uptime / 1000) % 60,
            }
            
            message.channel.send(embed.setDescription(`Bot şu kadar süredir aktif: \n${uptime.gün} gün ${uptime.saat} saat ${uptime.dakika} dakika ${uptime.saniye} saniye`));
           
    },
};