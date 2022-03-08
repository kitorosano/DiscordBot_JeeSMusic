const ytdl = require('ytdl-core');
module.exports = {
  name: 'leave',
  description: 'Expulsa al bot del canal de voz actual del usuario',
  guildOnly: true,
  async execute(msg, args, isMod) {
    if (msg.member.voice.channel) {
      await msg.member.voice.channel.leave();
    }
  }
}