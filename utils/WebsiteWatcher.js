import fetch            from 'node-fetch'
import { EmbedBuilder } from 'discord.js'

import guildsController from '../controllers/guildsController.js'
import itemsController  from '../controllers/itemsController.js'

const logo = 'https://static-cdn.jtvnw.net/jtv_user_pictures/399df447-15b1-4abd-9699-e6dfe30d84c8-profile_image-70x70.png'

class WebsiteWatcher {
	constructor (discordClient, watch = true) {
		this.client = discordClient
		this.watch  = watch

		if (watch) 
			this.watchForNewContent()
	}

	broadcastNewItems (topic, items) {
		const guilds                 = guildsController.all()
		const guildsWithChanForTopic = guilds.filter(g => !!g[`${topic}s`])

		guildsLoop:
		for (let i = 0; i < guildsWithChanForTopic.length; i++) {
			setTimeout(async () => {
				try {
					const guild = this.client.guilds.cache.get(guildsWithChanForTopic[i].id)

					if (!guild)
						return 

					const channel = guild.channels.cache.get(guildsWithChanForTopic[i][`${topic}s`])
					if (items.length > 1) {
						let image       = false 
						let description = ''
						multiItemsLoop:
						for (let j = 0; j < items.length; j++) {
							const item = items[j]
							// need to make sure the description is not longer than 4096 characters
							if (description.length > 4000) {
								description += `... and ${items.length - j} more.`
								break multiItemsLoop
							}
							description += `• **${item.title}** by ${
								item.author} [${item.tag}]. \n`

							if (!image && item.img)
								image = item.img
						}

						const embed = new EmbedBuilder()
							.setColor(15724527)
							.setTitle(`${items.length} new ${topic}s have been submitted on **forge.xboxera.com**!`)
							.setURL(`https://forge.xboxera.com/${topic}s`)
							.setThumbnail(logo)
							.setAuthor({
								name   : 'Forgera',
								iconURL: logo,
								url    : 'https://forge.xboxera.com/'
							})
							.setDescription(description)

						if (image) 
							embed.setImage(image)

						channel.send({ embeds: [embed] })
							.catch(err => {
								console.log(err)
								process.discordLogger.log(`in utils/WebsiteWatcher#broadcastNewItems: ${err.message}`)
							})
					} else {
						channel.send(`A new ${topic} has been submitted on **forge.xboxera.com**!`)
							.then(() => {
								channel.send({ embeds: [this.buildEmbed(items[0])] })
									.catch(err => process.discordLogger.log(`in utils/WebsiteWatcher#broadcastNewItems: ${err.message}`))
							})
							.catch(err => process.discordLogger.log(`in utils/WebsiteWatcher#broadcastNewItems: ${err.message}`))
					}
				} catch (err) {
					console.log(err)
					process.discordLogger.log(`in utils/WebsiteWatcher#broadcastNewItems: ${err.message}`)
				}
			}, i * 2000) // to avoid Discord API rate limit
		}
	}

	buildEmbed (item) {	
		const embed = new EmbedBuilder()
			.setColor(15724527)
			.setTitle(item.title)
			.setURL(item.link)
			.setThumbnail(logo)
			.setAuthor({
				name   : 'Forgera', 
				iconURL: logo, 
				url    : 'https://forge.xboxera.com/'
			})
			.setDescription(item.desc)
			.addFields([
				{
					name  : '👤 Author',
					value : item.author,
					inline: true
				},
				{
					name  : '🏷️ Tag',
					value : item.tag,
					inline: true
				}
			])
			.setFooter({
				text: `${item.downloads} downloads • ${item.views} views${item.featured ? ' • Featured! 🌟' : ''}`
			})

		if (item.img) 
			embed.setImage(item.img)

		return embed
	}

	async getNewItems (topic) {
		let data    = null
		const items = []

		try {
			const response = await fetch(`https://forge.xboxera.com/api/public/contents/${topic}s`)
			data           = await response.json()
		} catch (err) {
			process.discordLogger.log(`in utils/WebsiteWatcher#fetchMapList: ${err.message}`)
			return
		}

		if (!data?.data || !Array.isArray(data.data)) return

		for (const item of data.data) {
			if (itemsController.hasItem(item.id))
				continue

			items.push({
				id       : item.id,
				type     : topic,
				title    : item.name,
				desc     : item.short_description,
				author   : item.created_by.username,
				tag      : item.subcategory,
				link     : `https://forge.xboxera.com/content/${item.id}/${item.slug}`,
				img      : item.featured_image ? encodeURI(item.featured_image) : null,
				downloads: item.downloads,
				views    : item.views,
				featured : !!item.is_featured
			})
		}

		if (items.length > 0)
			itemsController.setItems(items)

		return items
	}

	async watchForNewContent () {
		const topics = ['map', 'mode', 'prefab']
		const check  = async () => {
			for (let i = 0; i < topics.length; i++) {
				const topic = topics[i]
				setTimeout(async () => {
					const items = await this.getNewItems(topic)

					if (items && items.length > 0)
						this.broadcastNewItems(topic, items)
				}, i * 5000)
			}
		}
		check()
		setInterval(check, 2 * 3600 * 1000)
	}
}

export default WebsiteWatcher
