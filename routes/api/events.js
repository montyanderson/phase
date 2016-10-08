const Event = require("../../lib/Event.js");

module.exports = [
	(req, res) => {
		Event.getRadius(req.query.longitude, req.query.latitude)
		.then((data) => {
			res.end(JSON.stringify(data));
		})
		.catch((err) => {
			console.log(err);
			res.end();
		});
	}
];
