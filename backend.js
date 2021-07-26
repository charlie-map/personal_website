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
	connection.query("SELECT * FROM old_project_web WHERE title=? AND parent_id=?", [req.body.renamed_value, req.body.parent_id], (err, options) => {
		if (err) console.log(err);

		if (options.length)
			res.end("0"); // can't be named this
		else {
			let parent_id_where = req.body.parent_id == "null" ? " IS NULL" : "=?";
			let answer_build = req.body.parent_id == "null" ? [req.body.renamed_value, req.body.previous_name] : [req.body.renamed_value, req.body.parent_id, req.body.previous_name];

			connection.query("UPDATE old_project_web SET title=? WHERE parent_id" + parent_id_where + " AND title=?", answer_build, (err, complete) => {
				if (err) console.log(err);
				res.end("1");
			});
		}
	});
});

/*
	In here will be a recursive process that will first go through the whole tree,
	and then work its way back up, deleting values as the process curries upwards
*/
function delete_full_branch(id) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id FROM old_project_web WHERE parent_id=?", id, async (err, sub_web) => {
			if (err) console.log(err);

			let webs = sub_web.map(under_subs => {
				delete_full_branch(under_subs.id);
			});

			await Promise.all(webs);
			connection.query("DELETE FROM old_project_web WHERE id=?", id, (err, completed) => {
				if (err) console.log(err);

				resolve();
			});
		});
	});
}

/*
	Running through a branch and curating a sub-branch to return to the main program
*/
function pull_off_branch(id) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT id FROM old_project_web WHERE parent_id=?", id, async (err, sub_web) => {
			if (err) console.log(err);

			resolve(sub_web);
		});
	});
}

/*
	Two params for delete:
	id: the id of the item being delete (integer)
	delete_flow: this is an option to either delete all of the items (recursively)
				 or merge the sub values into a different branch (woof!)
				 -- 0 for delete recursively
				 -- integer for merge (merging into a different branch)
*/
back.post("/delete", async (req, res) => {
	if (parseInt(req.body.delete_flow, 10) == 0) { // remove all items related to the main one
		await delete_full_branch(req.body.id);
		res.end();
	} else { // want to recursively generate an object, and then add it onto another branch
		let branch_adds = await pull_off_branch(req.body.id);
		let parent_string = parseInt(req.body.parent_id, 10) ? " parent_id=?" : " parent_id IS NULL";
		let query_params = req.body.parent_id ? [req.body.delete_flow, req.body.parent_id] : req.body.delete_flow
		if (branch_adds && branch_adds.length) connection.query("SELECT id FROM old_project_web WHERE title=? AND " + parent_string, query_params, async (err, complete) => {
			if (err) console.log(err);

			if (complete && complete.length) {
				let branch_fixes = branch_adds.map(branch => {
					console.log(branch);
					return new Promise((resolve, reject) => {
						connection.query("UPDATE old_project_web SET parent_id=? WHERE id=?", [complete[0].id, branch.id], (err, branch_done) => {
							if (err) console.log(err);

							resolve();
						});
					});
				});

				await Promise.all(branch_fixes);
			}
			connection.query("DELETE FROM old_project_web WHERE id=?", req.body.id, (err, finish) => {
				if (err) console.log(err);

				res.end("1");
			});
		});
		else connection.query("DELETE FROM old_project_web WHERE id=?", req.body.id, (err, finish) => {
			if (err) console.log(err);

			res.end("1");
		})	
	}
});

back.post("/add", (req, res) => {
	let project_link, class_needed = 0;

	let insert_object = [
		req.body.parent_id.length ? req.body.parent_id : null,
		req.body.name,
		req.body.folder_type == "folder" ? "button" : req.body.folder_type == "file" ? "background_change" : "link",
		req.body.completion_date,
		project_link,
		class_needed
	]

	connection.query("INSERT INTO old_project_web (parent_id, title, type, completion_date, project_link, class_needed)" +
		"VALUES(?, ?, ?, ?, ?, ?)", insert_object, (err, complete) => {
			if (err) console.log(err);

		});
});

module.exports = {
	back
};