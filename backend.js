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
const flash = require('flash');

const {
	pull_all_old_projects,
	connection,
	bodyParser,
	uuidv4,
	morgan
} = require('./utils');

const back = express.Router();

const isLoggedIn = function() {

}

passport.use(
	new strat({
			passReqToCallback: true // passing as a return value
		},
		function(req, username, password, done) {

			connection.query("SELECT * FROM user WHERE username=?", username, function(err, user) {
				if (err) return done(err);
				else if (!user || !user.length) {
					return done("-1", false);
				}

				if (password != user[0].password)
					return done("-2", false);

				return done(null, user[0]);
				// bcrypt.compare(password, user[0].password, (err, sim_check) => {
				// 	if (err) return done(err, false);
				// 	if (sim_check) return done(null, user[0]);

				// });
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

back.use(bodyParser.urlencoded({
	extended: false
}));

back.use(session({
	secret: uuidv4(),
	resave: false,
	saveUninitialized: false
}));

back.use(passport.initialize());
back.use(passport.session());
back.use(flash());

back.post("/login", (req, res, next) => {
	passport.authenticate('local', function(err, user, info) {
		if (err == "-1" || err == "-2") {
			return res.end(err);
		} else if (err) {
			return res.end(err);
		}
		if (user) {
			return res.end("1");
		}
	})(req, res, next);
});

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
	let height = old_project_obj[3];
	let svg_obj = old_project_obj.splice(1);
	let background_values = svg_obj.splice(1)[0];

	let max_height = 75 + ((height - 1) * 130);

	res.render("back_page", {
		NAME: "charlie hall",
		SPIDER_WEB: old_project_obj[0].toString().replace(/,/g, ""),
		SVG_ROWS: svg_obj[0],
		HEIGHT: max_height + "px",
		MAX_HEIGHT: max_height
	});
});

back.post("/rename", (req, res) => {

	// ensure that there are no repititions
	let id_split = req.body.change_item.split("_");
	connection.query("SELECT * FROM old_project_web WHERE title=? AND parent_id=?", [req.body.renamed_value, id_split[3]], (err, options) => {
		if (err) console.log(err);

		if (options.length)
			res.end("0"); // can't be named this
		else 
			console.log("updating to", req.body.renamed_value, "after", id_split[3], id_split[0]);
			let parent_id_where = id_split[3] == "null" ? " IS NULL" : "=?";
			let answer_build = id_split[3] == "null" ? [req.body.renamed_value, id_split[0]] : [req.body.renamed_value, id_split[3], id_split[0]];
			connection.query("UPDATE old_project_web SET title=? WHERE parent_id" + parent_id_where + " AND title=?", answer_build, (err, complete) => {
				if (err) console.log(err);

				res.end("1");
			});
	});
});

module.exports = {
	back
};