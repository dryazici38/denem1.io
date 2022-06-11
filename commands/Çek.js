
const emojis = require("../configs/emoji.json")


module.exports = {
  conf: {
    aliases: ["çek", "taşı"],
    name: "Çek",
    help: "çek <kullanıcı> Ses kanalaında yanınıza birisini çekmeyi sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8)) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Komutu kullanmak için gerekli yetkilere sahip değilsin!");
    if (!message.member.voice.channel) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Yanına birisini çekmek için bir ses kanalında olmalısın!"); 
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, '<a:f_isaret1:883470989646786591> Bir ses kanalında olman gerekiyor!');
    if (!member.voice.channel) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Belirtilen member herhangi bir ses kanalında değil!");
    member.voice.setChannel(message.member.voice.channelID);

    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member} üyesi \`${message.member.voice.channel.name}\` kanalına çekildi!`));
  },
};
