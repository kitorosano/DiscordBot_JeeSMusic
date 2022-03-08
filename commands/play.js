const ytdl = require('ytdl-core');
module.exports = {
  name: 'play',
  description: 'Reproduce musica desde YouTube',
  args: true,
  guildOnly: true,
  async execute(msg, args, isMod) {
    if (msg.member.voice.channel) {
      const connection = await msg.member.voice.channel.join();
    }


  }
}