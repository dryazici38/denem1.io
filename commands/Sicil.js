
const conf = require ("../configs/config.json");
const moment = require("moment");
moment.locale("tr");
const penals = require("../schemas/penals");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["sicil", "cezalar"],
    name: "Sicil",
    help: "sicil <kullanıcı> Kullanıcının ceza geçmişini gösterir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    let data = await penals.find({ guildID: message.guild.id, userID: member.user.id, }).sort({ date: -1 });
    if (data.length === 0) return message.channel.send(embed.setDescription(`${member.toString()} üyesinin sicili temiz!`)), message.react(emojis.mark);
    data = data.map((x) => `#${x.id} **[${x.type}]** ${moment(x.date).format("LLL")} tarihinde, <@${x.staff}> tarafından, \`${x.reason}\` nedeniyle, ${x.type.toLowerCase().replace("-", " ")} cezası almış.`).join("\n"), message.react(emojis.mark);
    for (var i = 0; i < Math.floor(data.length / 2000); i++) {
      message.channel.send(embed.setDescription(data.slice(0, 2000)));
      data = data.slice(2000);
    }
    if (data.length > 0) message.channel.send(embed.setDescription(data));
  },
};
