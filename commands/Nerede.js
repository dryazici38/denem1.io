const conf = require("../configs/config.json");
const voice = require("../schemas/voiceInfo");
const moment = require("moment");
require("moment-duration-format");
const emojis = require("../configs/emoji.json");

module.exports = {
  conf: {
    aliases: ["n", "nerede", "nerde", "ses"],
    name: "Ses",
    help: "ses <kullanıcı> Sesteki kullanıcının hangi odada olduğunu gösterir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    //     const channel = message.guild.channels.cache.get(args[0]);
    //     const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    //     if (channel) {
    //       const data = await voice.find({}).sort({ date: -1 });
    //       message.channel.sendEmbed(embed.setDescription(`
    // \`${channel.name}\` adlı kanaldaki üyelerin ses bilgileri:
    // ${channel.members.map((x) => `${x.toString()}: \`${data.find((u) => u.userID === x.user.id) ? moment.duration(Date.now() - data.find((u) => u.userID === x.user.id).date).format("H [saat], m [dakika], s [saniyedir]") : "Bulunamadı!"} seste.\``).join("\n")}
    //       `)), message.react(emojis.mark);
    //     } else {
    //       embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }));
    //       if (!member.voice.channel) return message.channel.error(message, `${member.toString()} üyesi herhangi bir ses kanalında bulunmuyor!`), message.react(emojis.cross);

    //       const data = await voice.findOne({ userID: member.user.id });
    //       message.channel.send(embed.setDescription(`
    // ${member.toString()} üyesi **${member.voice.channel.name}** kanalında. Mikrofonu: \`${member.voice.mute ? `Kapalı` : `Açık`}\` Kulaklığı: \`${member.voice.deaf ? `Kapalı` : `Açık`}\`
    // \`${data ? `${moment.duration(Date.now() - data.date).format("H [saat], m [dakika], s [saniyedir]")} seste.` : ""}\`
    //       `)), message.react(emojis.mark)};
    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member)
      message.channel
        .send(
          embed.setDescription(
            `Lütfen Kullanıcı Etiketleyiniz veya KullanıcıID Giriniz.`
          )
        )
        .catch((e) => {});

    let bilgi;
    if (member.voice.channel)
      bilgi = `**Ses Durumu** - \`Seste\` \n**Kanal Adı:** \`${
        member.voice.channel.name
      }\` \n**Kanal ID:** <#${member.voice.channel.id}> (\`${
        member.voice.channel.id
      }\`) \n **Mikrofonu:** \`${
        member.voice.mute ? `Kapalı` : `Açık`
      }\` \n **Kulaklığı:** \`${
        member.voice.deaf ? `Kapalı` : `Açık`
      }\` \n **Yayın Bilgisi:** \`${
        member.voice.streaming ? `Kapalı` : `Açık`
      }\` \n **Kamera Bilgisi:** \`${
        member.voice.selfVideo ? `Kapalı` : `Açık`
      }\` \n**Odadaki Kullanıcılar:**\n${member.voice.channel.members
        .array()
        .map((x, i) => `\`${i + 1}.\` ${x} (\`${x.id}\`) `)
        .slice(0, 5)
        .join(`\n`)} `;
    if (!member.voice.channel)
      bilgi = `**Ses Durumu** - \`Ses Kanalında Bulunmamakta\``;
    message.channel
      .send(
        embed.setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
          .setDescription(`
${member} (\`${member.id}\`) **Ses Bilgileri**
\n${bilgi}`)
      )
      .catch((e) => {});
  },
};
