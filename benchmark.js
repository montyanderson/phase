const benchmark = require("benchmark");

const haversine = require("./lib/haversine.js");
const Event = require("./lib/Event.js");

const obj = {
	name: "John",
	age: 45
};

function copy() {
	
};

(new benchmark.Suite)
.add("Object.assign()", () => {
	const o = {};
	Object.assign(o, obj);
})
.add("cp()", () => {
	const o = {};
	cp(o, obj);
})
.add("JSON.parse(JSON.stringify())", () => {
	const o = JSON.parse(JSON.stringify(obj));
})
.on('cycle', function(event) {
	console.log(String(event.target));
})
.run();


(new benchmark.Suite)
.add("blank function", () => {})
.add("haversine function", () => {
	haversine(Math.random * 180, Math.random * 180, Math.random * 180, Math.random * 180);
})
.add("Create an event, save it, load it, delete it", (d) => {
	const event = new Event({
		name: "event!",
		coords: {
			longitude: 0,
			latitude: 0
		}
	});

	event.save()
	.then(() => {
		return Event.load(event.id)
		.then(e => e.delete());
	})
	.then(() => d.resolve())
	.catch((err) => d.reject());

}, {defer: true})
.on('cycle', function(event) {
	console.log(String(event.target));
})
.run();
