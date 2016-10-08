const Event = require("../../lib/Event.js");

const googleMapsClient = require("@google/maps").createClient({
	key:  "AIzaSyCcR8fPVupxfvj34fHnFak2L2IxlzLK2WE"
});

module.exports = [
	(req, res, next) => {
		if(!req.user) throw new Error("User not logged in!");
		console.log(req.user);
		req.query.userID = req.user.id;

		googleMapsClient.geocode({
			address: req.query.address
		}, (err, response) => {
			const results = response.json.results;
			if(!results[0]) throw new Error("Failed to geocode!");

			req.query.coords = {
				longitude: results[0].geometry.location.lng,
				latitude: results[0].geometry.location.lat
			};

			console.log(req.query);

			next();
		});
	},
	(req, res) => {
		const e = new Event(req.query);

		e.save().then(() => {
			res.end(JSON.stringify({}));
		}).catch(err => {
			console.log(err);
			res.set(500);
			res.end("error!");
		});
	}
];
