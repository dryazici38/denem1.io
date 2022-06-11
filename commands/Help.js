const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")

module.exports = {
  conf: {
    aliases: ["help", "y", "h", "yardım"],
    name: "Yardım",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed, prefix) => {
    message.channel.send(embed.setDescription(client.commands.filter((x) => x.conf.help).sort((a, b) => b.conf.help - a.conf.help).map((x) => `**>** \`${prefix}${x.conf.help}\``).join("\n\n"))), message.react(emojis.mark);
  },
};
