const Joi = require("joi");
const db = require("./db.js");

const schema = {
	displayName: Joi.string(),
	id: Joi.number()
}

const User = module.exports = class User {
	constructor(data) {
		Object.assign(this, data);
	}

	static load(id) {
		return new Promise((resolve, reject) => {
			db.get("user:" + id, (err, res) => {
				if(err) return reject(err);
				const user = new User(JSON.parse(res));
				user.id = id;
				resolve(user);
			});
		});
	}

	validate() {
		return new Promise((resolve, reject) => {
			Joi.validate(this, schema, (err, value) => {
				if(err) return reject(err);
				resolve();
			});
		});
	}

	save() {
		const user = {};

		for(let key in this) {
			key != "id" && (user[key] = this[key]);
		}

		return new Promise((resolve, reject) => {
			db.set("user:" + this.id, JSON.stringify(user), (err) => {
				if(err) return reject(err);
				resolve();
			});
		});
	}
};
