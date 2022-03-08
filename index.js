const { Client, Collection, MessageEmbed, Intents } = require('discord.js');
const {
	prefix,
	token,
} = require('./config');
const fs = require('fs');

const client = new Client({
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
	intents: [
		'GUILDS',
		'GUILD_MEMBERS',
		'GUILD_PRESENCES',
		'GUILD_MESSAGES',
		'GUILD_MESSAGE_REACTIONS',
		'DIRECT_MESSAGES',
	],
});
client.commands = new Collection();
const cooldowns = new Collection();

/** OBTENER TODOS LOS COMANDOS */
const commandFiles = fs
	.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if (!command.disable) client.commands.set(command.name, command);
}
/** */

/** CUANDO SE ENVIA UN MENSAJE **/
client.on('messageCreate', async (msg) => {
	let { content, author, member, channel, guild } = msg;
	if (author.bot) return; // TERMINAR SI ES UN BOT

	if (!content.startsWith(prefix)) return; //TERMINAR SI NO ES UN COMANDO

	const args = content.slice(prefix.length).split(/ +/); //Obtengo un array con el comando sin el prefijo y los argumentos
	const commandName = args.shift().toLowerCase(); //Aparto el comando del array de los argumentos y lo hago minuscula.

	const command =
		client.commands.get(commandName) ||
		client.commands.find(
			(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
		);
	if (!command) return; //OBTENER COMANDO O SU ALIAS, Y SI ESTE NO EXISTE TERMINAR

	// const MsgNoMod = new MessageEmbed().setColor('RED').setDescription(':no_pedestrians: Alto ahí pantalones cuadrados... :eyes:')
	const isMod = member.roles.cache.find(
		(role) => role.name === 'Moderador' || role.name === 'Admin'
	);
	if (command.modOnly && !isMod) {
		// MENSAJE PARA COMANDOS SOLO DE MODERADORES
		return channel.send(
			`:no_pedestrians: **${author.username}**, alto ahí pantalones cuadrados.`
		);
	}

	if (command.guildOnly && channel.type === 'DM')
		return channel.send('No puedo ejecutar eso por mensaje directo');

	if (command.args && !args.length) {
		const replyMsg = new MessageEmbed()
			.setColor('RED')
			.setTitle(`Algo le falta al comando...`);

		if (command.usage) {
			replyMsg.setDescription(
				`El uso correcto sería: \`${prefix}${command.name} ${command.usage}\``
			);
		}
		return channel.send({ embeds: [replyMsg] });
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 2) * 1000;

	if (timestamps.has(author.id)) {
		const expirationTime = timestamps.get(author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			msg
				.reply(
					`por favor espera ${timeLeft.toFixed(
						1
					)} segundo(s) mas para reusar el comando \`${command.name}\``
				)
				.then((msg) => {
					setTimeout(() => msg.delete(), 5000);
				});
			return;
		}
	}
	timestamps.set(author.id, now);
	setTimeout(() => timestamps.delete(author.id), cooldownAmount);

	try {
		//ejecutar
		command.execute(msg, args, isMod);
	} catch (error) {
		console.error(error);
		const MsgError = new MessageEmbed()
			.setColor('RED')
			.setAuthor('Ha ocurrido un error al ejecutar el comando!');
		msg.reply(MsgError);
	}
});
/** */

/** CUANDO EL MENSAJE ES PARA REINCIAR EL BOT */
client.on('messageCreate', async (msg) => {
	let { channel, member, content } = msg;

	if (content !== '¡reset' && content !== '¡restart') return;
	const isMod = member.roles.cache.find((role) => role.name === 'Moderador');
	if (!isMod) return;

	channel
		.send('*Reiniciando...*')
		.then((msg) =>
			setTimeout(() => {
				msg.delete();
			}, 5000)
		)
		.then((m) => client.destroy())
		.then(() => client.login(token));
	console.log('bot reiniciado en: ' + channel.guild.name);

	startUp(client);
	const testChannel = await client.channels.fetch(channel.id);
	testChannel.send('**Buenas tardes!**');
});
/** */

/** COMPROBAR AL INICIAR EL BOT */
client.once('ready', async () => {
	console.log('Bot Connected');
	startUp(client);
});

client.login(token); //LOGEAR Y ARRANCAR EL BOT
