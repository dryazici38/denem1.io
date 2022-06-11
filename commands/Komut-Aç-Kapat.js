const Discord = require("discord.js");
const db = require('quick.db');
const ayar = require("../configs/settings.json")
module.exports = {
    conf: {
        aliases: ["komut", "command"],
        name: "Komut",
        help: `${ayar.prefix}komut <aç/kapat>`,
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        if (!message.member.hasPermission(8)) return;
        let komut = args[0]
        if (!komut) return;
        let data = await db.get(`command.${message.guild.id}`)
        if (komut === 'disabled' || komut === 'kapat') {
            if (data) return message.channel.send(embed.setDescription(`${message.member}, Komutlar bu kanalda kullanıma zaten kapalı.`))
            db.push(`command.${message.guild.id}`, message.channel.id)
            message.channel.send(embed.setDescription(`${message.member}, Komutlar bu kanalda kullanıma kapatıldı.`))
        }
        if (komut === 'enabled' || komut === 'aç') {
            if (!data) return message.channel.send(embed.setDescription(`${message.member}, Komutlar bu kanalda kullanıma zaten açık.`))
            db.set(`command.${message.guild.id}`, data.filter(s => s !== message.channel.id))
            message.channel.send(embed.setDescription(`${message.member}, Komutlar bu kanalda kullanıma açıldı.`))
        }
    },
};