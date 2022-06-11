const emojis = require("../configs/emoji.json")
module.exports = {
    conf: {
        aliases: ["unbanall", "unban-all", "topluaf", "toplu-af"],
        name: "Unbanall",
        help: ".unbanall",
    },

    /**
     * @param { Client } client
     * @param { Message } message
     * @param { Array<String> } args
     */

    run: async (client, message, args, embed) => {
        const bans = await message.guild.fetchBans()

        for (const cross of bans.array()) {
            await message.guild.members.unban(cross.user.id)
            message.react(emojis.emote)
        }
    },
};