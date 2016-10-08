const fs = require("fs");
const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
const passport = require("passport");
const Hogan = require("hogan.js");
const db = require("./lib/db.js");

require("./lib/passport.js");

const app = express();

app.use(session({
	store: new RedisStore({
		client: db
	}),
	secret: "cat keyboard",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth/facebook", passport.authenticate("facebook", {
	profileFields: ["picture.type(large)"]
}));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
	failureRedirect: "/"
}), (req, res) => {
	res.redirect("/");
});

app.get("/auth/google", passport.authenticate("google", {
	scope: ["https://www.googleapis.com/auth/plus.login"]
}));

app.get("/auth/google/callback", passport.authenticate("google", {
	failureRedirect: "/"
}), (req, res) => {
	res.redirect("/");
});

app.get("/logout", (req, res) => {
	req.session.destroy(() => {
		res.redirect("/");
	});
});

app.engine("mustache", (filePath, options, callback) => {
	fs.readFile(__dirname + "/views/layout.mustache", (err, file) => {
		if(err) callback(err);

		const layout = Hogan.compile(file.toString());

		fs.readFile(filePath, (err, file) => {
			if(err) callback(err);
			const view = Hogan.compile(file.toString()).render(options);
			callback(null, layout.render(Object.assign({}, options, {view})));
		});
	});
});

app.use((req, res, next) => {
	res.locals.req = req;
	next();
});

app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.get("/", (req, res) => res.render("index"));

app.use(express.static(__dirname + "/static"));

app.get("/api/events", ...require("./routes/api/events.js"));
app.get("/api/submit", ...require("./routes/api/submit.js"));

app.get("/user/:id", ...require("./routes/user.js"));

app.listen(8080);
