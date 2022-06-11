const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")

module.exports = {
  conf: {
    aliases: ["lock", "kilit"],
    name: "Kilit",
    help: "kilit Belirlenen kanalı kitler ve açar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
    let permObjesi = {};
    let everPermleri = message.channel.permissionOverwrites.get(everyone.id);
    everPermleri.allow.toArray().forEach(p => {
        permObjesi[p] = true;
    });
    everPermleri.deny.toArray().forEach(p => {
        permObjesi[p] = false;
    });
    if (message.channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
        permObjesi["SEND_MESSAGES"] = false;
        message.channel.createOverwrite(everyone, permObjesi);
        message.channel.send(embed.setDescription(`<a:f_isaret2:883470992104644639> <#${message.channel.id}> adlı kanal kilitlendi!`)), message.react(emojis.mark)
    } else {
        permObjesi["SEND_MESSAGES"] = true;
        message.channel.createOverwrite(everyone, permObjesi);
        message.channel.send(embed.setDescription(`<a:f_isaret1:883470989646786591> <#${message.channel.id}> adlı kanalın kilidi açıldı!`)), message.react(emojis.mark)
    };
  },
};
