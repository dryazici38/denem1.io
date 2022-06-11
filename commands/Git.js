
const emojis = require("../configs/emoji.json")
const conf = require("../configs/config.json");

module.exports = {
  conf: {
    aliases: ["git"],
    name: "Git",
    help: "git <kullanıcı> Ses kanallarında birisinin yanına gitmenizi sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.voice.channelID) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bir ses kanalında olmalısın!"), message.react(emojis.cross);
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bir kullanıcı belirtmelisin!"), message.react(emojis.cross);
    if (!member.voice.channelID) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Bu kullanıcı herhangi bir ses kanalında bulunmuyor!"), message.react(emojis.cross);
    if (message.member.voice.channelID === member.voice.channelID) return message.channel.error(message, "<a:f_isaret1:883470989646786591> Zaten aynı kanaldasınız!"), message.react(emojis.cross);
    const question = await message.channel.send(member.toString(), { embed: embed.setDescription(`<a:f_isaret2:883470992104644639> ${member}, ${message.author} \`${member.voice.channel.name}\` odasına gelmek istiyor. Kabul ediyor musun?`) });
    await question.react(emojis.mark);
    await question.react(emojis.cross);
    const answer = await question.awaitReactions((reaction, user) => [emojis.mark, emojis.cross].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("<a:f_isaret2:883470992104644639> İşlem iptal edildi!")) });
    if (answer.first().emoji.toString() === emojis.mark) {
      embed.setColor("GREEN");
      question.edit(embed.setDescription(`<a:f_isaret2:883470992104644639> ${member}, <@${message.author.id}> isteğini kabul etti`));
      message.member.voice.setChannel(member.voice.channel);
    } else {
      embed.setColor("RED");
      question.edit(embed.setDescription(`<a:f_isaret1:883470989646786591> ${member} odaya çekilme teklifini reddetti`));
    }
  },
};
