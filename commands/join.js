const ytdl = require('ytdl-core');
module.exports = {
	disable: true,
  name: 'join',
  description: 'Une al bot al canal de voz actual del usuario',
  guildOnly: true,
  async execute(msg, args, isMod) {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
    } else {
      return msg.channel.send('Debes unirte a un canal de voz primero!')
    }
  }
}