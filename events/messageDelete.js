const moment = require("moment");
moment.locale("tr");
const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const snipe = require("../schemas/snipe");

module.exports = async (message) => {
  if (message.author.bot) return;

  await snipe.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $set: { messageContent: message.content, author: message.author.id, image: message.attachments.first() ? message.attachments.first().proxyURL : null, createdDate: message.createdTimestamp, deletedDate: Date.now() } }, { upsert: true });
  const channel = message.guild.channels.cache.get(conf.logs.messageLog);
  if (!channel) return;
  const embed = new MessageEmbed()
    .setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
    .setColor("BLACK")
    .setDescription(` ${message.member} üyesi **${message.channel.name}** kanalında bir mesaj sildi. \n\n Silinen Mesaj İçeriği: __${message.content}__ \n\n \`Kullanıcı: ${message.author.tag} (${message.author.id})\``)
    .setFooter(`• ${moment().calendar()}`);
  
  if (message.attachments.first()) embed.setImage(message.attachments.first().proxyURL);
  channel.send(embed);
};

module.exports.conf = {
  name: "messageDelete",
};
