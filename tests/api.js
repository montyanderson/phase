const assert = require("assert");
const querystring = require("querystring");
const got = require("got");
require("../index.js");

describe("Route /api/submit", () => {
	it("should return 200 on submit", () => {
		return got("http://localhost:8080/api/submit?" + querystring.stringify({
			name: "MIT Party!",
			address: "MIT, Cambridge, MA, United States",
			date: "16 November 2017"
		}));
	});
});

describe("Route /api/events", () => {
	it("should return the event", () => {
		return got("http://localhost:8080/api/events?longitude=-71.09&latitude=42.35")
		.then((res) => {
			const data = JSON.parse(res.body);
			assert.ok(data.length > 0, res.body);
			const event = data[0];

			assert.ok(event.name === "MIT Party!", "name");
			assert.ok(!!event.coords.longitude, "longitude");
			assert.ok(!!event.coords.latitude, "latitude");
		});
	});
});
