const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const penals = require("../schemas/penals");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["unvmute"],
    name: "Un-Vmute",
    help: "unvmute <kullanıcı> Ses kanallarında mutelenmiş kullanıcının mutesini açmayı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.voiceMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Yeterli yetkin bulunmuyor!"), message.react(emojis.cross);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Bir üye belirtmelisin!"), message.react(emojis.cross);
    if (!conf.penals.voiceMute.roles.some(x => member.roles.cache.has(x)) && (member.voice.channelID && !member.voice.serverMute)) return message.channel.error(message, "Bu üye muteli değil!"), message.react(emojis.cross);
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "Kendinle aynı yetkide ya da daha yetkili olan birinin susturmasını kaldıramazsın!"), message.react(emojis.cross);
    if (!member.manageable) return message.channel.error(message, "Bu üyenin susturmasını kaldıramıyorum!");

    member.roles.remove(conf.penals.voiceMute.roles);
    if (member.voice.channelID && member.voice.serverMute) member.voice.setMute(false);
    const data = await penals.findOne({ userID: member.user.id, guildID: message.guild.id, type: "VOICE-MUTE", active: true });
    if (data) {
      data.active = false;
      data.removed = true;
      await data.save();
    }
    message.channel.send(embed.setDescription(`${member.toString()} üyesinin **sesli kanallarda** susturması, ${message.author} tarafından kaldırıldı!`)), message.react(emojis.mark);
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından **sesli kanallarda** olan susturmanız kaldırıldı!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("BLACK")
      .setDescription(`
${member.toString()} üyesinin **sesli kanallarda** susturması kaldırıldı!
Susturmayı Kaldıran Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Susturması Kaldırılan Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Susturmanın Kaldırılma Tarihi: \`${moment(Date.now()).format("LLL")}\`
      `);
    message.guild.channels.cache.get(conf.penals.voiceMute.log).send(log);
  },
};
