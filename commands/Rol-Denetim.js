const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const moment = require("moment");
const ms = require('ms');
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["roldenetim", "rdenetim"],
    name: "Roldenetim",
    help: "roldenetim <rol/ıd> Aktif, seste olmayan, seste olan kullanıcıları gösterir",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("BAN_MEMBERS") && !conf.penals.ban.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription("Yeterli yetkin bulunmuyor!")), message.react(emojis.cross);
let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!rol) message.reply(embed.setDescription('Bir rol idsi girmelisin')), message.react(emojis.cross)

    let offline = message.guild.members.cache.filter(s => s.roles.cache.has(rol.id) && s.presence.status === 'offline')
    let ses = message.guild.members.cache.filter(s => s.roles.cache.has(rol.id) && s.voice.channel)
    let unses = message.guild.members.cache.filter(s => s.roles.cache.has(rol.id) && !s.voice.channel)
    await message.channel.send(`Roldeki aktif olmayan kullanıcı sayısı: ${offline.size}\n\n${offline.map(s => s).join(', ') || 'Yok'}`, { code: "xl" })
    await message.channel.send(`Roldeki seste olan kullanıcı sayısı: ${ses.size}\n\n${ses.map(s => s).join(', ') || 'Yok' }`, { code: "xl" })
    await message.channel.send(`Roldeki seste olmayan kullanıcı sayısı: ${unses.size}\n\n${unses.map(s => s).join(', ') || 'Yok'}`, { code: "xl" })
    message.react(emojis.mark)
}
};
