require('dotenv').config({
	path: __dirname + "/.env"
});
const express = require('express');

const bcrypt = require('bcrypt');
const saltRounds = 11;

// setting up password
const session = require('express-session');
const passport = require('passport');
const strat = require('passport-local').Strategy;

const {
	pull_all_old_projects,
	connection,
	bodyParser,
	uuidv4,
	morgan
} = require('./utils');

const back = express.Router();

passport.use(
	new strat({
			passReqToCallback: true // passing as a return value
		},
		function(req, username, password, done) {
			connection.query("SELECT * FROM user WHERE username=?", username, function(err, user) {
				if (err) return done(err);
				else if (!user.length) return done(null, false, 0);

				bcrypt.compare(password, user[0].password, (err, sim_check) => {
					if (err) return done(err, false);
					if (sim_check) return done(null, user[0]);

				});
			});
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {

	connection.query("SELECT * FROM user WHERE id=?", id, (err, user) => {
		if (err) return done(err, null);
		else return done(null, user[0]);

	});
});

back.use(morgan('dev'));
back.use(express.static(__dirname + "/private"));

back.use(session({
	secret: uuidv4(),
	resave: false,
	saveUninitialized: false
}))

back.use(passport.initialize());
back.use(passport.session());

back.post("/login", passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/'
}));

back.get("/", (req, res) => {
	res.render("login_page", {
		NAME: "charlie hall"
	});
});

back.get("/overview", async (req, res) => {
	let old_project_obj;

	// grabs all projects from database, creates recursive div and
	// adds all the data into svg, which is used for line drawing
	old_project_obj = await pull_all_old_projects(null, 0, 0);
	let svg_obj = old_project_obj.splice(1);
	let background_values = svg_obj.splice(1)[0];

	res.render("back_page", {
		NAME: "charlie hall"
	});
});

module.exports = {
	back
};