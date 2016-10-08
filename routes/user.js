const User = require("../lib/User.js");

module.exports = [
	(req, res, next) => {
		User.load(req.params.id).then((user) => {
			res.locals.user = user;
			console.log(user);
			next();
		}).catch(() => next());
	},
	(req, res, next) => {
		res.render("profile");
	}
];
