const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const keys = require("../keys");
const User = require("./User.js");

passport.serializeUser((user, done) => {
	user.save()
		.then(() => done(null, user.id))
		.catch(err => done(err));
});

passport.deserializeUser((id, done) => {
	User.load(id)
	.then((user) => done(null, user))
	.catch((err) => done(err));
});

passport.use(new FacebookStrategy({
	clientID: keys.facebook.clientID,
	clientSecret: keys.facebook.clientSecret,
	callbackURL: "http://localhost:8080/auth/facebook/callback"
}, (accessToken, refreshToken, profile, cb) => {
	const user = new User(profile);

	user.save()
		.then(() => cb(null, user));
}));

passport.use(new GoogleStrategy({
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret,
	callbackURL: "http://localhost:8080/auth/google/callback"
}, (token, tokenSecret, profile, done) => {
	const user = new User(profile);

	user.save()
		.then(() => done(null, user));
}));
