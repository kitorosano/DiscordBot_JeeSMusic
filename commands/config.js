// GENERAL Configuration for the server, store in database

// configure main text channel, for event,

module.exports = {
  disable: true,
	name: 'config',
  description: 'Configuracion del servidor para el bot',
  aliases: ['setup', 'options'],
  usage: '<option> <value>',
  guildOnly: true,
  modOnly: true,
  async execute(msg, args, isMod) {

  } 
}
