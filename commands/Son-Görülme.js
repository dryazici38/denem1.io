const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment")
module.exports = {
    conf: {
        aliases: ["son-görülme", "stalk"],
        name: "Stalk",
        help: "Son-Görülme",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if(!member) return message.channel.send(message.member, embed.setDescription(`**Bir kullanıcı etiketlemelisin.**`)).then(x => x.delete({timeout: 5000}))
        let urea = db.get(`status_${member.id}`)
        if(!urea) return message.channel.send(message.member, embed.setDescription(`**Üyenin geçmiş** *son görülme* **bilgisi bulunamadı veya** *çevrimiçi*.`)).then(x => x.delete({timeout: 5000}))
        let time = `${moment.duration(Date.now() - urea).format("D [gün], H [saat], m [dakika], s [saniye]")} **Önce Çevrimdışı Olmuş**`
        message.channel.send(embed.setDescription(`${member} kulllanıcısı;
        ${time}`))
    },
};