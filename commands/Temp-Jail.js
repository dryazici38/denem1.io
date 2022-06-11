const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const jailLimit = new Map();
moment.locale("tr");
const ms = require("ms");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["tempjail", "tjail", "sjail", "sürelijail", "scezalı", "tcezalı", "sürelicezalı"],
    name: "Temp-Jail",
    help: "tempjail <kullanıcı> <süre> <sebep> Belirlenen kullanıcıya süreli jail atar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.jail.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(embed.setDescription("Yeterli yetkin bulunmuyor!")), message,react(emojis.cross);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Bir üye belirtmelisin!"), message.react(emojis.cross);
    if (conf.penals.jail.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "Bu üye zaten jailde!"), message.react(emojis.cross);
    const duration = args[1] ? ms(args[1]) : undefined;
    if (!duration) return message.channel.error(message, `Geçerli bir süre belirtmelisin!`), message.react(conf,emojis.cross);
    const reason = args.slice(2).join(" ") || "Belirtilmedi!";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(embed.setDescription("Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!")), message.react(emojis.cross);
    if (!member.manageable) return message.channel.error(message, "Bu üyeyi jailleyemiyorum!"), message.react(emojis.cross);
    if (conf.penals.jail.limit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == conf.penals.jail.limit) return message.channel.error(message, "Saatlik jail sınırına ulaştın!"), message.react(emojis.cross);

    member.setRoles(conf.penals.jail.roles);
    const penal = await client.penalize(message.guild.id, member.user.id, "TEMP-JAIL", true, message.author.id, reason, true, Date.now() + duration);
    message.channel.send(embed.setDescription(`${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle jaillendi! \`(Ceza Numarası: #${penal.id})\``)), message.react(emojis.mark);
    const time = ms(duration).replace("h", " saat").replace("m", " dakika").replace("s", " saniye");
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, **${time}** boyunca jaillendiniz!`).catch(() => {});
    
    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("BLACK")
      .setDescription(`
${member.toString()} üyesi, \`${time}\` sunucudan süreli olarak cezalandırıldı! (Ceza ID: \`#${penal.id}\`)
Cezalandıran Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Cezalandırılan Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Cezalı Tarihi: \`${moment(Date.now()).format("LLL")}\`
Cezalı Bitiş Tarihi: \`${moment(Date.now() + duration).format("LLL")}\`
Cezalı Sebebi: \`${reason}\`
      `)
    message.guild.channels.cache.get(conf.penals.jail.log).send(log);

    if (conf.penals.jail.limit > 0) {
      if (!jailLimit.has(message.author.id)) jailLimit.set(message.author.id, 1);
      else jailLimit.set(message.author.id, jailLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (jailLimit.has(message.author.id)) jailLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
