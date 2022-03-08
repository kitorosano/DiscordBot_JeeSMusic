const ytdl = require('ytdl-core');
const servers = require('../utils/servers');

const play = (connection, msg) => {
	const { author, guild, channel, client, member } = msg;

	const server = servers[guild.id];

	server.dispatcher = connection.playStream(
		ytdl(server.queue[0], {
			filter: 'audioonly',
		})
	);

	server.queue.shift();

	server.dispatcher.on('end', () => {
		if (server.queue[0]) play(connection, msg);
		else
			setTimeout(() => {
				connection.disconnect();
			}, 180000); //disconnect after 3 minutes of innactivity
	});
};

module.exports = {
	name: 'play',
	description: 'Reproduce musica desde YouTube',
	aliases: ['p'],
	usage: '[url]',
	args: true,
	guildOnly: true,
	async execute(msg, args, isMod) {
		const { author, guild, channel, client, member } = msg;

		if (!args.length) return channel.send('Y el link master? xd');

		if (!servers[guild.id])
			server[guild.id] = {
				queue: [],
			};

		const server = servers[guild.id];

    server.queue.push(args[1]); //queue a new song

		if (member.voice.channel) {
			const connection = await member.voice.channel.join();
			play(connection, msg);
		}
	},
};
