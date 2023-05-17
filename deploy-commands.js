// this shouldn't be necessary
require('dotenv').config()

const { REST, Routes } = require('discord.js')
const fs               = require('node:fs')
const path             = require('node:path')

const rest              = new REST().setToken(process.env.DISCORD_TOKEN)
const setChannelCommand = require('./commands/setChannel.js').data


;(async () => {
	try {
		console.log('Refreshing application commands.')

		const guilds = fs.readFileSync(path.join(__dirname, 'data', 'guilds.json'), 'utf8')
		for (const guild of guilds) {
			await rest.put(
				Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
				{ body: [setChannelCommand] }
			)
		}
		console.log('Done.')
	} catch (error) {
		console.error(error)
	}
})()
