
const emojis = require("../configs/emoji.json")
module.exports = {
    conf: {
        aliases: ["reboot", "reset"],
        name: "Reboot",
        help: "Reboot",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        message.channel.send("Bot yeniden başlatılıyor...").then(msg => {
            console.log("[BOT] Yeniden başlatılıyor...");
            process.exit(0);
        });
        message.react(emojis.emote);
    },
};