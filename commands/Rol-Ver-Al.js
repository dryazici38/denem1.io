const conf = require("../configs/config.json");
const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const moment = require("moment");
const ms = require('ms');
const banLimit = new Map();
moment.locale("tr");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["r"],
    name: "Rol-Ver-Al",
    help: "r [ver/al] Kullanıcıya rol verip almayı sağlar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission(8) && !conf.penals.rveral.staffs.some(x => message.member.roles.cache.has(x))) return message.channel.error(message, "Yeterli yetkin bulunmuyor!"), message.react(emojis.cross);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
     if(!member) return message.channel.send(embed.setDescription(`Lütfen bir üyeyi etiketle ve tekrar dene!`)), message.react(emojis.cross)
     let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
     if(!rol) return message.channel.send(`Lütfen bir rol belirt ve tekrar dene!`), message.react(emojis.cross)
  
     if (!message.member.hasPermission('ADMINISTRATOR')) {
     if (rol.id === "883096671779696712") return message.channel.send(`${message.author}`, embed.setDescription(`Bu rol yasaklı roller listesinde bulunuyor!`)).then(x => x.delete({timeout: 5000})) 
     }
 
  if (!message.member.hasPermission('ADMINISTRATOR')) {
     if (rol.id === "883096674791215114") return message.channel.send(`${message.author}`, embed.setDescription(`Bu rol yasaklı roller listesinde bulunuyor!`)).then(x => x.delete({timeout: 5000})) 
     }
  
     if(member.roles.highest.position <= rol.position) return message.channel.send(`${message.author}`, embed.setDescription(`${member} üyesinin en yüksek rolü ${member.roles.highest}, ve bu rolden daha yüksek bir rol veremezsiniz!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.cross)
     if(message.member.roles.highest.position <= rol.position) return message.channel.send(`${message.author}`, embed.setDescription(`Sizin en yüksek rolünüz ${message.member.roles.highest}, ve bu rolü veya daha yüksek bir rolü vermezsiniz!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.cross)
   if (args[0] == "ver") {
       if(!member.roles.cache.has(rol)) {
await member.roles.add(rol)
message.channel.send(embed.setDescription(`${member} üyesine ${rol} rolü başarıyla verildi!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.mark)
let kanal1 = message.guild.channels.cache.get(conf.penals.rveral.log);
kanal1.send(embed.setDescription(`${member} üyesine ${message.author} tarafından ${rol} rolü başarıyla verildi!`))
       } else {
    message.channel.send(embed.setDescription(`${member} üyesinde ${rol} rolü zaten bulunmakta!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.cross)
       }
   } else if (args[0] == "al") {
if(member.roles.cache.has(rol)) {
    message.channel.send(embed.setDescription(`${member} üyesinde ${rol} rolü yok!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.cross)
} else {
    await member.roles.remove(rol)
    message.channel.send(embed.setDescription(`${member} üyesinden ${rol} rolü başarıyla alındı!`)).then(x => x.delete({timeout: 5000})), message.react(emojis.mark)
    let kanal11 = message.guild.channels.cache.get(conf.penals.rveral.log);
    kanal11.send(embed.setDescription(`${member} üyesine ${message.author} tarafından ${rol} rolü başarıyla alındı!`))
}
   } else if (!args[0]) { 
       message.channel.send(embed.setDescription(`Lütfen bir argüman belirt. \`!rol {al/ver} {user} {role}\` `)), message.react(emojis.cross)
   }
 }
};
