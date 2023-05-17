import { PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js'

import guilds        from '../controllers/guildsController.js'
import generateEmbed from '../utils/generateEmbed.js'

const topics = [
	{ name: 'Everything', value: 'all' },
	{ name: 'Maps', value: 'maps'},
	{ name: 'Modes', value: 'modes'},
	{ name: 'Prefabs', value: 'prefabs'}
]

export default {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('(Admins only) Set the channel for the bot to post in.')
		.addStringOption(option => 
			option.setName('topic')
				.setDescription('What kind of auto-post you want to set up')
				.setRequired(true)
				.addChoices(...topics)
		)
		.addChannelOption(option =>
			option
				.setName('target')
				.setDescription('The target channel for this auto-post')
				.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionsBitField.ADMINISTRATOR),
	execute: async interaction => {
		if (!interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR)) {
			return await interaction.reply({
				embeds: [generateEmbed({
					color      : 15548997,
					title      : 'FORBIDDEN',
					description: 'You do not have permission to use this command.'
				})],
				ephemeral: true
			})
		}

		const topic   = interaction.options.getString('topic')
		const channel = interaction.options.getChannel('target')

		if (!channel.isTextBased()) {
			return await interaction.reply({
				embeds: [generateEmbed({
					color      : 15548997,
					title      : 'WRONG TYPE OF CHANNEL',
					description: 'The target channel must be a text channel.'
				})],
				ephemeral: true
			})
		}

		const botGuildMember = await interaction.guild.members.fetch(interaction.client.user)

		if (!botGuildMember.permissionsIn(channel).has(PermissionFlagsBits.ViewChannel) ||
			!botGuildMember.permissionsIn(channel).has(PermissionFlagsBits.SendMessages)) {
			return await interaction.reply({
				embeds: [generateEmbed({
					color      : 15548997,
					title      : 'NOT ALLOWED',
					description: 'It seems I cannot send messages into the channel you gave me; make sure you granted me enough permissions to do that, then try again.'
				})],
				ephemeral: true
			})
		}
	
		const update = guilds.updateTopicTarget(interaction.guild.id, topic, channel.id)

		if (!update) {
			return await interaction.reply({
				embeds: [generateEmbed({
					color      : 15548997,
					title      : 'ERROR',
					description: 'Something went wrong; please try again.'
				})],
				ephemeral: true
			})
		}

		await channel.send({
			embeds: [generateEmbed({
				color      : 5763719,
				title      : 'Hello there 👋',
				description: topic !== 'all'
					? `I will now show the latest ${topic} posted on Forgera in this channel.`
					: 'I will now show the latest maps, modes and prefabs from Forgera in this channel.'
			})]
		})

		return await interaction.reply({
			embeds: [{
				color      : 5763719,
				title      : 'CHANNEL SET',
				description: `I will now post ${topic} updates in ${channel}.`
			}],
			ephemeral: true
		})
	}
}
