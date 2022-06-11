const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const banLimit = new Map();
moment.locale("tr");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["tagtara"],
    name: "tagtara",
    help: "tagtara Tagı olmayan kullanıcılara taglı permi vermeyi sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    let tag = "flex"
    let tag2 = "fléx"
    let tag3 = "𝄪"
    let etiket = "1969"
    let rol = "890337671510110260"
    let taglilar = message.guild.members.cache.filter(s => s.user.username.includes(tag) && !s.roles.cache.has(rol))
    let taglilar2 = message.guild.members.cache.filter(s => s.user.username.includes(tag2) && !s.roles.cache.has(rol))
    let taglilar3 = message.guild.members.cache.filter(s => s.user.username.includes(tag3) && !s.roles.cache.has(rol))
    let etiketliler = message.guild.members.cache.filter(s => s.user.discriminator.includes(etiket) && !s.roles.cache.has(rol))

    taglilar.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    taglilar2.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    taglilar3.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    etiketliler.array().forEach(async(member, index) => {
        setTimeout(async() => {
            await member.roles.add(rol)
        }, index * 1000)
    })
    embed.setDescription(`
**${taglilar.size + taglilar2.size + taglilar3.size + etiketliler.size}** Adet kullanıcıya taglı rolü verilecek
`)
    message.channel.send(embed), message.react(emojis.mark)
}
};
