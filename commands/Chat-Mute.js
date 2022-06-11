const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const muteLimit = new Map();
moment.locale("tr");
const ms = require("ms");

module.exports = {
  conf: {
    aliases: ["mute", "sustur", "chatmute", "chat-mute", "cmute"],
    name: "Chat-Mute",
    help: "cmute <kullanıcı> <süre> <sebep> Metin kanallarında mute atmayı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.chatMute.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Komutu kullanmak için gerekli yetkilere sahip değilsin!"), message.react(emojis.cross);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Metin kanallarında mutelemek istediğin kullanıcıyı belirtmelisin!"), message.react(emojis.cross);
    if (conf.penals.chatMute.roles.some(x => member.roles.cache.has(x))) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üye zaten susturulmuş!"), message.react(emojis.cross);
    const duration = args[1] ? ms(args[1]) : undefined;
    if (!duration) return message.channel.error(message, `<a:f_isaret1:883470989646786591> Geçerli bir süre belirtmelisin!`), message.react(emojis.cross);
    const reason = args.slice(2).join(" ") || "Sebep Belirtilmedi!";
    if (!message.member.hasPermission(8) && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Kendinle aynı yetkide ya da daha yetkili olan birini susturamazsın!"), message.react(emojis.cross);
    if (!member.manageable) return message.channel.error(message, "Bu üyeyi susturamıyorum!");
    if (conf.penals.chatMute.limit > 0 && muteLimit.has(message.author.id) && muteLimit.get(message.author.id) == conf.penals.chatMute.limit) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Saatlik susturma sınırına ulaştın! 1 Saat sonra tekrar dene!"), message.react(emojis.cross);

    member.roles.add(conf.penals.chatMute.roles);
    const penal = await client.penalize(message.guild.id, member.user.id, "CHAT-MUTE", true, message.author.id, reason, true, Date.now() + duration);
    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member.toString()} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle susturuldu! \`(Ceza Numarası: #${penal.id})\``)), message.react(emojis.mark);
    const time = ms(duration).replace("s", " saniye").replace("m", " dakika").replace("h", " saat").replace("d", " gün");
    if (conf.dmMessages) member.send(`**${message.guild.name}** sunucusunda, **${message.author.tag}** tarafından, **${reason}** sebebiyle, **${time}** boyunca susturuldunuz!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(member.user.username, member.user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setDescription(`
${member.toString()} üyesi, \`${time}\` süresi boyunca metin kanallarında susturuldu! (Ceza Numarası: \`#${penal.id}\`)
Susturan Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Susturulan Üye: ${member.toString()} \`(${member.user.username.replace(/\`/g, "")} - ${member.user.id})\`
Susturma Tarihi: \`${moment(Date.now()).format("LLL")}\`
Susturma Bitiş Tarihi: \`${moment(Date.now() + duration).format("LLL")}\`
Susturma Sebebi: \`${reason}\`
      `);
    message.guild.channels.cache.get(conf.penals.chatMute.log).send(log);

    if (conf.penals.chatMute.limit > 0) {
      if (!muteLimit.has(message.author.id)) muteLimit.set(message.author.id, 1);
      else muteLimit.set(message.author.id, muteLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (muteLimit.has(message.author.id)) muteLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
