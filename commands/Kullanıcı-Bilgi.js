const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const ayarlar = require("../configs/settings.json");
module.exports = {
  conf: {
    aliases: ["kullanıcı-bilgi", "kullanıcıbilgi", "userinfo", "user-info"],
    name: "Kullanıcı-Bilgi",
    help: ".kullanıcı-bilgi <@üye/id>",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args) => {
    let user;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
      user = message.author;
    }

    const member = message.guild.member(user);

    const embed = new Discord.MessageEmbed()
      .setColor("RANDOM")

      .setAuthor(user.username, user.avatarURL({ dynamic: true, size: 2048 }))
      .setThumbnail(user.avatarURL({ dynamic: true, size: 2048 }))
      .setTitle(`${user.username}#${user.discriminator} Kullanıcı Bilgi'si`)
      .setDescription(`
      **İsim :** ${user.username}#${user.discriminator}\n
      **İd :** \`${user.id}\`\n
      **Hesap Oluşturma Tarihi :** \`${moment.utc(user.createdAt).format("dddd, MMMM.Do.YYYY, ")}\`\n
      **Sunucuya Katılma Tarihi :** \`${moment.utc(member.joinedAt).format("dddd, MMMM.Do.YYYY")}\`\n
      **Aktivitesi :** ${user.presence.activities}\n
`)
    message.channel.send({ embed });
  },
};
