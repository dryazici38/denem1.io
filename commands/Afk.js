const afk = require("../schemas/afk");
const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")

module.exports = {
    conf: {
        aliases: ["afk"],
        name: "Afk",
        help: "afk <Sebep> Afk olmanızı sağlar.",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        const reason = args.join(" ") || "Belirtilmedi!";
        let Afk = await afk.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        });
        if (!Afk) Afk = await new afk({
            guildID: message.guild.id,
            userID: message.member.id,
            reason: ``,
            date: 0,
            check: null
        }).save()

        Afk.reason = reason
        Afk.check = true
        Afk.date = Date.now()
        Afk.save()
		
        message.channel.send(embed.setDescription(`Başarıyla afk moduna girdiniz!`)).then(msg => msg.delete({
            timeout: 5000
        }), message.react(emojis.mark));
        console.log(Afk.check)
        if (message.member.manageable) message.member.setNickname(`[AFK] ${message.member.displayName}`);
    },
};