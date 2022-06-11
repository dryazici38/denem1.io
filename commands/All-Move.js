const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["allmove", "herkesitaşı", "toplutaşı"],
    name: "Allmove",
    help: "allmove <kanal id> Ses kanalındaki herkesi belirlenen ses kanalına taşır.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MOVE_MEMBERS")) return;
    if (!args[0])  message.channel.error(message, "<a:f_isaret1:883470989646786591> Üyelerin taşınacağı bir kanal ID'si girmelisin!"), message.react(emojis.cross);
    if (message.member.voice.channelID) {
      const channel = message.member.voice.channel;
      channel.members.forEach((x, index) => {
        client.wait(index * 1000);
        x.voice.setChannel(args[0]);
      });
      message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> \`${channel.name}\` kanalındaki tüm üyeler \`${message.guild.channels.cache.get(args[0]).name}\` adlı kanala taşındı!`)), message.react(emojis.mark);
    } else {
      const channel = message.guild.channels.cache.get(args[0]);
      channel.members.forEach((x, index) => {
        client.wait(index * 1000);
        x.voice.setChannel(args[1]);
      });
      message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> \`${channel.name}\` kanalındaki tüm üyeler \`${message.guild.channels.cache.get(args[1]).name}\` adlı kanala taşındı!`)), message.react(emojis.mark)
    }
  },
};
