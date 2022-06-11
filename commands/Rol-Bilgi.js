const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const moment = require("moment");
const ms = require('ms');
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["rolbilgi", "rbilgi", "rol-bilgi"],
    name: "Bol-Bilgi",
    help: "rolbilgi <rol/ıd> Rol hakkında detaylı bilgilendirme yapar.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
  if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(embed.setDescription(`Bu komutu kullanmak için gerekli yetkiye sahip değilsin!`)).then(msg => msg.delete({timeout: 5000}), message.react(emojis.cross))
  let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(m => m.name === args.slice(0).join(" "))
  if(!rol) return message.channel.send(new MessageEmbed().setDescription(`Lütfen tüm argümanları doğru giriniz.\nÖrnek Kullanım: .rolbilgi @Rol/ID/Rolisim`).setColor('RANDOM').setAuthor(message.author.tag, message.member.user.avatarURL({dynamic: true}))).then(msg => msg.delete({timeout: 5000}), message.react(emojis.cross))
	  var aylar = {
  "01": "Ocak",
  "02": "Şubat",
  "03": "Mart",
  "04": "Nisan",
  "05": "Mayıs",
  "06": "Haziran",
  "07": "Temmuz",
  "08": "Ağustos",
  "09": "Eylül",
  "10": "Ekim",
  "11": "Kasım",
  "12": "Aralık"
}
  message.channel.send(`• ${rol} rol bilgileri\n- Rol Rengi: \`${rol.hexColor}\`\n• Rol ID: \`${rol.id}\`\n • Rolün Pozisyonu: \`${rol.position}\`\n • Rol Etiketlenmesi: \`${rol.mentionabble ? 'Evet' : 'Hayır'}\`\n • Rolün Oluşturulduğu Zaman: \`${moment(rol.createdAt).format('DD')} ${aylar[moment(rol.createdAt).format('MM')]} ${moment(rol.createdAt).format('YYYY HH:mm:ss')}\`\n • Entegrasyon mu?: \`${rol.managed ? 'Evet' : 'Hayır'}\`\n─────────────────\n •Rol Kişi Sayısı: \`${rol.members.size}\`\n • Roldeki Kişiler:\n`)
  let Parzival =  `${rol.members.map(m=> m .toString()+ " - " + "(\`"+m.id+"\`)").join("\n")}`
  for (var i = 0; i < (Math.floor(Parzival.length/2000)); i++) {
  message.channel.send(Parzival.slice(0, 2040));
  Parzival = Parzival.slice(2040);
  };
  if (Parzival.length > 0) message.channel.send(Parzival), message.react(emojis.mark);
}
};
