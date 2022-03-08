const ytdl = require('ytdl-core');

module.exports = {
  name: 'leave',
  description: 'Expulsa al bot del canal de voz actual del usuario',
  guildOnly: true,
  async execute(msg, args, isMod) {
		const { author, guild, channel, client, member } = msg;

    if (member.voice.channel) {
      await member.voice.channel.leave();
    }
  }
}