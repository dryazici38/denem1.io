
const emojis = require("../configs/emoji.json")
const conf = require("../configs/config.json");
const moment = require("moment");
moment.locale("tr");
const penals = require("../schemas/penals");

module.exports = {
  conf: {
    aliases: ["ceza-sorgu", "cezasorgu", "ceza-bilgi", "cezaıd", "ceza-ıd"],
    name: "Cezabilgi",
    help: "cezabilgi <ceza ıd> Ceza ıdsinin ceza bilgisini gösterir."
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (isNaN(args[0])) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Ceza ID'si bir sayı olmalıdır!"), message.react(emojis.cross);
    const data = await penals.findOne({ guildID: message.guild.id, id: args[0] });
    if (!data) return message.channel.error(message, `<a:f_isaret1:883470989646786591> ${args[0]} ID'li bir ceza bulunamadı!`);
    message.channel.send(embed.setDescription(`Ceza Numarası \`#${data.id}\` Olan Cezanın Bilgileri:  \n**[${data.type}]** <@${data.userID}> üyesi, ${moment(data.date).format("LLL")} tarihinde, <@${data.staff}> tarafından, \`${data.reason}\` nedeniyle, ${data.type.toLowerCase().replace("-", " ")} cezası almış.`)), message.react(emojis.mark);  },
};
