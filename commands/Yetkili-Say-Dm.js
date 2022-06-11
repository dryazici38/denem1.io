const conf = require("../configs/config.json");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: [],
    name: "yetkili",
    help: "yetkili <say> <dm> Yetkilililer hakkında istatistik, özelden dm atar."
  },

  
  run: async (client, message, args, embed) => {
    if(message.member.hasPermission('ADMINISTRATOR')) {
        let qqq = args[0];
        if(!qqq) return message.channel.send(embed.setDescription(`Bir veri belirtiniz. \`.yetkili say/dm\` `)).catch(e => { })
    
        if(qqq == "say"){
        let sesdedeğil = message.guild.members.cache.filter(x => x.roles.cache.has("890340920128569427")).filter(y => !y.voice.channel&& y.presence.status!="offline")
    message.channel.send(`Aktif olup ses kanallarında olmayan yetkili sayısı: ${sesdedeğil.size}
	──────────────────────────────────
	Aktif olup seste olmayan yetkililer :
	
${sesdedeğil.map(s => `${s}`).join(' , ')}`)
      }
    
    if(qqq == "dm"){
      let kullanıcı = message.guild.members.cache.filter(s => s.roles.cache.has("890340920128569427")).filter(s => !s.voice.channel).size
    for(var i = 0;i < kullanıcı;i++){
      let a = message.guild.members.cache.filter(s => s.roles.cache.has("890340920128569427")).filter(s => !s.voice.channel).map(a => a)[i]
      const userDM = await a.createDM()
    try {
      await userDM.send("Merhaba Flex ekibinde her hangi bir ses kanalına değilsin. Müsaitsen public odalara müsait değilsen sleep room veya priv odalarında afk bırakabilirsin. Ses veriniz yetkiniz yükselirken önemlidir unutmayın!")
    } catch {
      await message.channel.send(`<@${a.user.id}> merhaba dm kutun kapalı olduğu için burdan yazıyorum. Müsaitsen public odalara müsait değilsen sleep room veya priv odalarında afk bırakabilirsin. Ses veriniz yetkiniz yükselirken önemlidir unutmayın!`)
    }
    }
      }
    
    } else 
     return message.channel.send(embed.setDescription(`Bu Komutu Kullanmak İçin Gerekli Yetkiye Sahip Değilsin.`))
}}