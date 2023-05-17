import * as fs           from 'fs'
import { fileURLToPath } from 'url'
import * as path         from 'path'
import { dirname }       from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
let data        = null
const _flush    = () => {
	if (!data) return

	try {
		fs.writeFileSync(path.join(__dirname, '../data/guilds.json'), JSON.stringify(data, null, 2))
		_fetchData()
	} catch (err) {
		process.discordLogger.log(`in controllers/guildsController#_flush: ${err}.`)
		return false
	}

	return true
}

const _fetchData = () => {
	data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/guilds.json'), 'utf8'))
}

export default {
	all: () => {
		_fetchData()
		return data
	},

	get: id => {
		_fetchData()

		const guild = data.find(g => g.id === id)
		if (!guild)
			return null

		return guild
	},

	setGuild: guild => {
		_fetchData()

		const thisGuild = data.find(g => g.id === guild.id)
		if (!thisGuild)
			data.push({ id: guild.id, name: guild.name, maps: null, modes: null, prefabs: null })

		return _flush()
	},

	updateTopicTarget: (guildId, topic, target) => {
		_fetchData()

		let thisGuild = data.find(d => d.id === guildId)
		if (!thisGuild)
			return

		switch (topic) {
			case 'all':
				thisGuild = Object.assign(thisGuild, { maps: target, modes: target, prefabs: target })
				break
			default:
				thisGuild = Object.assign(thisGuild, { [topic]: target })
				break
		}

		return _flush()
	},

	unsetGuild: guild => {
		_fetchData()

		const thisGuild = data.find(g => g.id === guild.id)
		if (!thisGuild) return

		data = data.filter(g => g.id !== guild.id)

		return _flush()
	}
}
