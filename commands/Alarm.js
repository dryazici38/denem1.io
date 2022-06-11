const ayar = require("../configs/settings.json")
const Discord = require('discord.js');
const ms = require('ms')
module.exports = {
    conf: {
        aliases: ["alarm"],
        name: "Alarm",
        help: `${ayar.prefix}alarm <1h,1m,1s> <hatırlatacağım şey>`,
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        let süre = args [0] 
  
        if(!süre) return message.channel.send(`${ayar.prefix}alarm <1h,1m,1s> <hatırlatacağım şey>`)
        
        let alarm = args.slice(1).join(' ')
        
        if(!alarm) return message.channel.send(`${ayar.prefix}alarm <1h,1m,1s> <hatırlatacağım şey>`)
        
        message.channel.send(`Alarm Kuruldu **${süre}** Sonra Size Bildireceğim`)
        
        setTimeout(() => {
        
        message.channel.send(`<@${message.author.id}>\n`,embed.setDescription(`Hatırlatmamı İstediğin Şeyin Zamanı Geldi\n**${alarm}**`));
        
        }, ms(süre));

    },
};