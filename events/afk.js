const {
    MessageEmbed
} = require("discord.js");
const afk = require("../schemas/afk");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = async (message) => {
    if (message.author.bot || !message.guild) return;
    const data = await afk.findOne({
        guildID: message.guild.id,
        userID: message.author.id
    });
    const embed = new MessageEmbed().setColor(message.member.diplayHexColor).setAuthor(message.member.displayName, message.author.avatarURL({
        dynamic: true
    }));
    if (data) {
        if (!data.check) return;
        data.check = false
        data.save()
        if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
        embed.setDescription(`Afk modundan çıktınız. ${moment.duration(Date.now() - data.date).format("d [gün] H [saat], m [dakika] s [saniye]")} önce \`${data.reason}\` sebebiyle afk olmuştunuz.`);
        message.channel.send(embed).then((x) => x.delete({
            timeout: 10000
        }));
    }

    const member = message.mentions.members.first()
    if (member) {
        let afkData = await afk.findOne({
            userID: member.id,
            guildID: message.guild.id
        })
        console.log(afkData)
        if (afkData && afkData.check) {
            embed.setDescription(`${member.toString()} kullanıcısı, \`${afkData.reason}\` sebebiyle, **${moment.duration(Date.now() - afkData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** önce afk oldu!`);
            message.channel.send(embed).then((x) => x.delete({
                timeout: 15000
            }));
        }
    };
}
module.exports.conf = {
    name: "message",
};