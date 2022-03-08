module.exports = {
  disable: true,
  name: 'ping',
  description: 'Tiempo de respuesta del bot a tus mensajes',
  guildOnly: true,
  cooldown: 5,
  execute(msg, args, isMod) {
    msg.channel.send('pong');
  }
}