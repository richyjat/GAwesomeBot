/**
 * Class for handling ExtensionManager events
 * @class
 */
class EventsHandler {
	/**
	 * Construct a new EventsHandler and hook it into the provided ExtensionManager
	 * @param {ExtensionManager} manager The ExtensionManager to hook into and listen to for events
	 * @param {string[]} events A list of events to listen for
	 */
	constructor (manager, events) {
		this.manager = manager;
		this.events = [...events, "message"];

		this.events.forEach(event => {
			this.manager.on(event, this._handlerWrapper(this[event] || this.defaultHandler));
		});
	}

	async message (msg) {
		if (!msg.guild || msg.author.id === this.manager.user.id || msg.author.bot) return;
		winston.silly("Handling incoming public message as extension handler...", { svrid: msg.guild.id });

		const serverDocument = await Servers.findOne(msg.guild.id);
		return serverDocument;
	}

	defaultHandler () {
		return null;
	}

	_handlerWrapper (func) {
		return async (...args) => {
			try {
				await func(...args);
			} catch (err) {
				winston.error("An exception occurred while trying to run an extension.", err);
			}
		};
	}
}

module.exports = EventsHandler;
