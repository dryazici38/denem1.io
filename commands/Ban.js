const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["yargı", "ban", "banla", "yasakla"],
    name: "Ban",
    help: "ban <kullanıcı> <sebep> Sunucudan birisini banlamayı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("BAN_MEMBERS") && !conf.penals.ban.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.send(embed.setDescription("<a:f_isaret1:883470989646786591> Komutu kullanmak için gerekli yetkilere sahip değilsin!")), message.react(emojis.cross);
    if (!args[0]) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Lütfen tüm argümanları eksiksiz giriniz.\nSunucudan banlamak istediğin üyeyi belirtmelisin!"), message.react(emojis.cross);
    const user = message.mentions.users.first() || await client.fetchUser(args[0]);
    if (!user) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Böyle bir kullanıcı bulunamadı!"), message.react(emojis.cross);
    const ban = await client.fetchBan(message.guild, args[0]);
    if (ban) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üye zaten sunucudan banlı gözküyor!"), message.react(emojis.cross);
    const reason = args.slice(1).join(" ") || "Sebep Belirtilmedi!";
    const member = message.guild.members.cache.get(user.id);
    if (!message.member.hasPermission(8) && member && member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(embed.setDescription("<a:f_isaret1:883470989646786591> Kendinle aynı yetkide ya da daha yetkili olan birini banlayamazsın!")), message.react(emojis.cross);
    if (member && !member.bannable) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu üyeyi banlayamazsın!"), message.react(emojis.cross);
    if (conf.penals.ban.limit > 0 && banLimit.has(message.author.id) && banLimit.get(message.author.id) == conf.penals.ban.limit) return message.channel.send(embed.setDescription("<a:f_isaret1:883470989646786591> Saatlik ban sınırına ulaştın! 1 Saat sonra tekrar dene!")), message.react(emojis.cross);
    
    message.guild.members.ban(user.id, { reason }).catch(() => {});
    const penal = await client.penalize(message.guild.id, user.id, "BAN", true, message.author.id, reason);
    const gifs = ["https://media1.tenor.com/images/ed33599ac8db8867ee23bae29b20b0ec/tenor.gif?itemid=14760307", "https://media.giphy.com/media/fe4dDMD2cAU5RfEaCU/giphy.gif", "https://media1.tenor.com/images/4732faf454006e370fa9ec6e53dbf040/tenor.gif?itemid=14678194"];
    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member ? member.toString() : user.username} üyesi, ${message.author} tarafından, \`${reason}\` nedeniyle banlandı! \`(Ceza Numarası: #${penal.id})\``).setImage(gifs.random())), message.react(emojis.mark);
    if (conf.dmMessages) user.send(`**${message.guild.name}** sunucusundan, **${message.author.tag}** tarafından, **${reason}** sebebiyle banlandınız!`).catch(() => {});

    const log = new MessageEmbed()
      .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
      .setColor("RED")
      .setDescription(`
${member ? member.toString() : user.username} üyesi sunucudan yasaklandı! (Ceza Numarası: \`#${penal.id}\`)
Banlayan Yetkili: ${message.author} \`(${message.author.username.replace(/\`/g, "")} - ${message.author.id})\`

Banlanan Üye: ${member ? member.toString() : ""} \`(${user.username.replace(/\`/g, "")} - ${user.id})\`
Ban Tarihi: \`${moment(Date.now()).format("LLL")}\`
Ban Sebebi: \`${reason}\`
      `)
    message.guild.channels.cache.get(conf.penals.ban.log).send(log);

    if (conf.penals.ban.limit > 0) {
      if (!banLimit.has(message.author.id)) banLimit.set(message.author.id, 1);
      else banLimit.set(message.author.id, banLimit.get(message.author.id) + 1);
      setTimeout(() => {
        if (banLimit.has(message.author.id)) banLimit.delete(message.author.id);
      }, 1000 * 60 * 60);
    }
  },
};
