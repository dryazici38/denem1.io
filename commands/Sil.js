
const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["sil", "mesajsil", "delete"],
    name: "Sil",
    help: "sil <miktar> Belirlenen miktar kadar mesaj siler.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) return;
    if (!args[0]) return message.channel.error(message, "Kaç mesaj silmek istediğini belirtmelisin!"), message.react(emojis.cross);
    if (isNaN(args[0])) return message.channel.error(message, "Belirttiğin miktar bir sayı olmalı!"), message.react(emojis.cross);
    await message.delete();
    await message.channel.bulkDelete(args[0]);
    message.channel.send(embed.setDescription(`\`${args[0]}\` **Adet mesaj** \`${message.channel.name}\` **kanalından silindi.**\n **__Mesajı Silen Yetkili:__** ${message.author}`)), message.react(emojis.mark);
  },
};
