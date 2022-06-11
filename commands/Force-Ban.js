const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")

const { MessageEmbed } = require("discord.js");
const moment = require("moment");
moment.locale("tr");
const settings = require("../configs/settings.json");
const forceBans = require("../schemas/forceBans");

module.exports = {
  conf: {
    aliases: ["permaBan", "forceBan", "permaban", "force-ban", "perma-ban", "botban", "Parzivalban", "forceban"],
    name: "Forceban",
    help: "forceban <kullanıcı> <sebep> Kalıcı olarak ban atıp, açmanızı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return message.react(emojis.cross);
    if (!args[0]) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Sunucudan kalıcı olarak banlamak için bir üye belirtmelisin!"), message.react(emojis.cross);
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Böyle bir kullanıcı bulunamadı!"), message.react(emojis.cross);
    const ban = await forceBans.findOne({ guildID: message.guild.id, userID: user.id });
    if (ban) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üye zaten banlı!"), message.react(emojis.cross);
    const reason = args.slice(1).join(" ") || "Sebep Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription("<a:f_isaret1:883470989646786591> Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!")), message.react(emojis.cross);
    if (member && !member.bannable) return message.channel.error(message, "Bu üyeyi banlayamıyorum!"), message.react(emojis.cross);
    
    message.guild.members.ban(user.id, { reason }).catch(() => {});
    await new forceBans({ guildID: message.guild.id, userID: user.id, staff: message.author.id }).save();
    const penal = await client.penalize(message.guild.id, user.id, "FORCE-BAN", true, message.author.id, reason);
    const gifs = ["https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307", "https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif", "https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194"];
    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member ? member.toString() : user.username} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle **kalıcı olarak** banlandı! \`(Ceza Numarası: #${penal.id})\``).setImage(gifs.random())), message.react(emojis.mark);
    if (conf.dmMessages) user.send(`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle **kalıcı olarak** banlandınız!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setDescription(`
${member ? member.toString() : user.username} üyesi sunucudan **Kalıcı Olarak** banlandı! (Ceza Numarası: \`#${penal.id}\`)
Banlayan Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Banlanan Üye: ${member ? member.toString() : ""} \`(${user.username.replace(/\`/g, "")} - ${user.id})\`
Ban Tarihi: \`${moment(Date.now()).format("LLL")}\`
Ban Sebebi: \`${reason}\`
      `)
      .setImage(gifs.random())
    message.guild.channels.cache.get(conf.penals.ban.log).send(log);
  },
};
