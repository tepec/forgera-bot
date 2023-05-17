export default {
	async init (client) {
		const { owner }       = await client.application.fetch()
		this.maintainer       = owner
		process.discordLogger = this
	},

	log (message) {
		if (!this.maintainer)
			return 

		this.maintainer
			.send(message)
			.catch(err => {
				console.error(err.rawError)
			})
	}
}
