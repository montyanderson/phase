const assert = require("assert");
const Event = require("../lib/Event.js");
const db = require("../lib/db.js");

describe("Event", () => {
	const obj = {
		name: "Party!",
		description: "Hi!",
		amountOfFood: 400,
		coords: {
			longitude: -0.1257400,
			latitude: 51.5085300
		}
	};

	describe("constructor()", () => {
		const e = new Event(obj);

		it("should return an Event object", () => {
			assert.ok(e instanceof Event);
		});

		it("should only include event properties", () => {
			assert.equal(obj.name, e.name);
			assert.notEqual(obj.amountOfFood, e.amountOfFood);
		});

		it("should convert coordinates to numbers", () => {
			assert.ok(typeof e.coords.latitude == "number");
			assert.ok(typeof e.coords.longitude == "number");
		});
	});

	describe("generateID()", () => {
		it("should generate an id between 1 and 5 characters", () => {
			const e = new Event(obj);

			return e.generateID().then(() => {
				assert.ok(e.id.length >= 1);
				assert.ok(e.id.length <= 5);
			});
		});
	});

	let a, b;

	describe("save()", () => {
		it("should save the event", () => {
			a = new Event(obj);
			return a.save();
		});


		it("should have saved a key in the db", () => {
			return new Promise((resolve, reject) => {
				db.exists("event:" + a.id, (err, val) => {
					val ? resolve() : reject(new Error("key not found in db!"));
				});
			});
		});
	});

	describe("load()", () => {
		it("should load the event", () => {
			return Event.load(a.id).then(e => b = e);
		});

		it("should be exactly the same as the original event object", () => {
			[a, b].forEach((e) => {
				["longitude", "latitude"].forEach((i) => e.coords[i] = e.coords[i].toFixed(2));
			});

			for(let key in a) {
				assert.equal(JSON.stringify(a[key]), JSON.stringify(b[key]));
			}
		});
	});

	describe("delete()", () => {
		it("should delete the event", () => {
			return Event.load(a.id).then(e => e.delete());
		});

		it("should have removed the key in the db", () => {
			return new Promise((resolve, reject) => {
				db.exists("event:" + a.id, (err, val) => {
					!val ? resolve() : reject(err);
				});
			});
		});
	});
});
