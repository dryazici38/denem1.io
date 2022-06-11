const snipe = require("../schemas/snipe");
const conf = require ("../configs/config.json");
const moment = require("moment");
require("moment-duration-format");
const { MessageEmbed } = require("discord.js");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["snipe"],
    name: "Snipe",
    help: "snipe <miktar> Metin kanalında son silinen mesajı gösterir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const data = await snipe.findOne({ guildID: message.guild.id, channelID: message.channel.id });
    if (!data) return message.channel.error(message, "Bu kanalda silinmiş bir mesaj bulunmuyor!"), message.react(emojis.cross);
    const author = await client.fetchUser(data.author);
    embed.setDescription(`<@${data.author}> üyesi **${message.channel.name}** kanalında bir mesaj sildi.
${data.messageContent ? `\n**Silinen mesaj içeriği: ** __${data.messageContent}__` : ""}
**Mesajın Sahibi:** <@${data.author}>
**Silinen mesajın yazılma tarihi:** \`${moment.duration(Date.now() - data.createdDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce\`
**Silinen mesajın silinme tarihi:** \`${moment.duration(Date.now() - data.deletedDate).format("D [gün], H [saat], m [dakika], s [saniye]")} önce\`

\`Kullanıcı: ${message.author.tag} (${message.author.id})\`
    `);
    if (author) embed.setAuthor(author.tag, author.avatarURL({ dynamic: true, size: 2048 }));
    if (data.image) embed.setImage(data.image);
    message.channel.send(embed), message.react(emojis.mark);
  },
};
