/* To invite the bot on your server:
 * https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=0&scope=bot%20applications.commands
 * 
 */ 

import * as dotenv                                       from 'dotenv'
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'

dotenv.config()

import logger            from './utils/discordLogger.js'
import guildsController  from './controllers/guildsController.js'
import setChannelCommand from './commands/setChannel.js'
import WebsiteWatcher    from './utils/WebsiteWatcher.js'

const client    = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

client.commands.set('setup', setChannelCommand)

client.on(Events.GuildCreate, async guild => {
	guildsController.setGuild(guild)
	guild.commands.set([setChannelCommand.data.toJSON()])
	process.discordLogger.log(`Joined ${guild.name} (${guild.id}).`)
})

client.on(Events.GuildDelete, async guild => {
	guildsController.unsetGuild(guild)
	process.discordLogger.log(`Left ${guild.name} (${guild.id}).`)
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand())
		return

	const command = interaction.client.commands.get(interaction.commandName)

	if (!command)
		return process.discordLogger.log(`in index.js#onInteractionCreate: No command matching ${interaction.commandName} was found.`)

	try {
		await command.execute(interaction)
	} catch (error) {
		process.discordLogger.log(`in index.js#onInteractionCreate: ${error}.`)

		await interaction.reply({
			embeds: [generateEmbed({
				color      : 15548997,
				title      : 'ERROR',
				description: 'There was an error while executing this command.'
			})],
			ephemeral: true
		})
	}
})

client.once(Events.ClientReady, async () => {
	await logger.init(client)
	new WebsiteWatcher(client)
	process.discordLogger.log('The bot is up!')
})

client.login(process.env.DISCORD_TOKEN)
