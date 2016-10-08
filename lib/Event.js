const hashids = new (require("hashids"));
const Joi = require("joi");
const haversine = require("./haversine.js");
const db = require("./db.js");
const User = require("./User.js");

const schema = {
	userID: Joi.required(),
	user: Joi.object(),
	id: Joi.string().required().alphanum(),
	name: Joi.string().required().min(3).max(50),
	description: Joi.string().max(500),
	date: Joi.date(),
	coords: {
		longitude: Joi.number().required().min(-180).max(180),
		latitude: Joi.number().required().min(-180).max(180)
	}
};

module.exports = class Event {
	constructor(e) {
		for(let key in schema) {
			this[key] = e[key];
		}

		if(this.coords) {
			if(this.coords.longitude) this.coords.longitude = +this.coords.longitude;
			if(this.coords.latitude) this.coords.latitude = +this.coords.latitude;
		}
	}

	static load(id) {
		return new Promise((resolve, reject) => {
			db.multi()
			.get("event:" + id)
			.geopos("map", id)
			.exec((err, res) => {
				if(err) return reject(err);

				const data = Object.assign({}, JSON.parse(res[0]), {
					id, coords: {
						longitude: res[1][0][0],
						latitude: res[1][0][1]
					}
				});

				resolve(data);
			});
		}).then(data => {
			return User.load(data.userID)
			.then(user => {
				data.user = user;
				return new Event(data);
			});
		});
	}

	from(longitude, latitude) {
		const m = haversine(this.coords.longitude, this.coords.latitude, longitude, latitude);
		this.distance = (m / 1000).toFixed(2);
	}

	generateID() {
		return new Promise((resolve, reject) => {
			const n = Math.floor(Math.random() * Math.pow(10, 11));
			const id = hashids.encode([id]);


			db.exists("event:" + id, (err, val) => {
				if(!val) {
					this.id = id;
					resolve(this);
				} else {
					this.generateID()
					.then(() => resolve(this))
					.catch(() => reject(this));
				}
			});
		});
	}

	validate() {
		return new Promise((resolve, reject) => {
			Joi.validate(this, schema, (err) => {
				if(err) return reject(err);
				resolve();
			});
		});
	}

	save() {
		const save = (resolve, reject) => {
			//if(!this.validate()) return reject(new Error("Validation error!"));

			db.multi()
			.set("event:" + this.id, JSON.stringify({
				name: this.name,
				description: this.description,
				date: this.date,
				address: this.address,
				userID: this.userID
			}))
			.geoadd("map", this.coords.longitude, this.coords.latitude, this.id)
			.exec((err) => {
				err ? reject(err) : resolve();
			});
		};

		if(this.id) return this.validate().then(() => new Promise(save));
		return this.generateID().then(() => this.validate()).then(() => new Promise(save));
	}

	delete() {
		return new Promise((resolve, reject) => {
			db.multi()
			.del("event:" + this.id)
			.zrem("map", this.id)
			.exec((err) => {
				err ? reject(err) : resolve();
			});
		});
	}

	static getRadius(longitude, latitude, radius = 25) {
		return new Promise((resolve, reject) => {
			db.georadius("map", longitude, latitude, radius, "km", "ASC", (err, data) => {
				if(err) return reject(err);

				Promise.all(data.map(e => Event.load(e)))
				.then((events) => {
					events.forEach(e => e.from(longitude, latitude));
					resolve(events);
				}).catch((err) => {
					reject(err);
				});
			});
		});
	}
};
