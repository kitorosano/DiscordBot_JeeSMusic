const ytsr = require('ytsr');
module.exports = {
  name: 'search',
  description: 'Busca un video en YouTube.',
  args: true,
  guildOnly: true,
  execute(msg, args, isMod) {
    let filter = "";
    args.forEach(t => filter+=t+" ");

  }
}