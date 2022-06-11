const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const jailLimit = new Map();
moment.locale("tr");
const emojis = require("../configs/emoji.json")

module.exports = {
  conf: {
    aliases: ["karantina", "cezalı", "jail"],
    name: "Jail",
    help: "jail <kullanıcı> <sebep> Cezalıya atmanızı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.jail.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(embed.setDescription("Yeterli yetkin bulunmuyor!")), message.react(emojis.cross);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Sunucuda cezalandırmak istediğin bir üye belirtmelisin!"), message.react(emojis.cross);
    if (conf.penals.jail.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üye zaten sunucuda cezalı!"), message.react(emojis.cross);
    const reason = args.slice(1).join(" ") || "Sebep Belirtilmedi!";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(embed.setDescription("<a:f_isaret1:883470989646786591> Kendinle aynı yetkide ya da daha yetkili olan birini jailleyemezsin!")), message.react(emojis.cross);
    if (!member.manageable) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üyeyi jailleyemiyorum!");
    if (conf.penals.jail.limit > 0 && jailLimit.has(message.author.id) && jailLimit.get(message.author.id) == conf.penals.jail.limit) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Saatlik jail sınırına ulaştın! 1 Saat sonra tekrar dene!"), message.react(emojis.cross);

    member.setRoles(conf.penals.jail.roles);
    const penal = await client.penalize(message.guild.id, member.user.id, "JAIL", true, message.author.id, reason);
    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle jaillendi! \`(Ceza Numarası: #${penal.id})\``)), message.react(emojis.mark);
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle cezalıya atıldınız!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setDescription(`
${member.toString()} üyesi sunucuda cezalıya gönderildi! (Ceza Numarası: \`#${penal.id}\`)
Jailleyen Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Jaillenen Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Jail Tarihi: \`${moment(Date.now()).format("LLL")}\`
Jail Sebebi: \`${reason}\`
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
