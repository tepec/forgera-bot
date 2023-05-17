import * as fs           from 'fs'
import { fileURLToPath } from 'url'
import * as path         from 'path'
import { dirname }       from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
let data        = null
const _flush    = () => {
	if (!data) return

	try {
		fs.writeFileSync(path.join(__dirname, '../data/items.json'), JSON.stringify(data, null, 2))
		_fetchData()
	} catch (err) {
		process.discordLogger.log(`in controllers/itemsController#_flush: ${err}.`)
		return false
	}

	return true
}

const _fetchData = () => {
	data = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/items.json'), 'utf8'))
}

export default {
	all: () => {
		_fetchData()
		return data
	},

	get: id => {
		_fetchData()

		const item = data.find(i => i.id === id)
		if (!item)
			return null

		return item
	},

	hasItem: id => {
		_fetchData()
		return !!data.find(i => i.id === id)
	},

	setItem: item => {
		_fetchData()

		const thisItem = data.find(i => i.id === item.id)
		if (!thisItem)
			data.push(item)

		return _flush()
	},

	setItems: items => {
		_fetchData()

		data.push(...items)

		return _flush()
	}
}

