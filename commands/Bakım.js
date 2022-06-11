const Discord = require('discord.js')
const ayarlar = require("../configs/settings.json");
const db = require('quick.db')
module.exports = {
    conf: {
        aliases: [""],
        name: "",
        help: "",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        if(!ayarlar.owners.includes(message.author.id)) return message.reply('Bu komut bot sahibine özeldir!');
        if(args[0] === "başlat" || args[0] === "yap") {
          if(!args[1]) return message.reply('Bakım nedeni girmelisin!')
          await db.set('botbakim', args.slice(1).join(' '))
          message.reply(`Bot başarıyla \`${args.slice(1).join(' ')}\` nedeni ile bakıma alındı!`)
          return
        }
        
        if(args[0] === "bitir" || args[0] === "sonlandır") {
          await db.delete('botbakim')
          message.reply('Bot bakımı başarıyla sonlandırıldı!')
          return
        }
    },
};