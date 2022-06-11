const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["allunmute", "toplususturmakaldır", "herkesinsusturmasınıkaldır", "toplususturmaaç"],
    name: "Allunmute",
    help: "allunmute Sesli kanaldaki herkesin sağ tık mutesini açar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("MOVE_MEMBERS")) return;
    let channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
    if (!channel) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bir kanal ID girmeli ya da bir sesli kanalda bulunmalısın!"), message.react(emojis.cross);
    channel.members.forEach((x, index) => {
      client.wait(index * 1000);
      x.voice.setMute(false);
    });
    message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> \`${channel.name}\` kanalındaki tüm üyelerin susturulması başarıyla kaldırıldı!`)), message.react(emojis.mark);
  },
};
