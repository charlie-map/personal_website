require('dotenv').config({
	path: __dirname + "/.env"
});
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
	host: process.env.HOST,
	database: process.env.DATABASE,
	user: process.env.USER_NAME,
	password: process.env.PASSWORD,
	insecureAuth: false
});

connection.connect((err) => {
	if (err) throw err;
});

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
	extended: false
}));
app.set('views', __dirname + "/views");
app.set('view engine', 'mustache');
app.engine('mustache', mustache());

// go through the root objects recursively
function pull_all_data(parent_id, level) {
	let return_array = [];
	return new Promise((resolve, reject) => {
		let where_clause = !parent_id ? " parent_id IS NULL" : " parent_id=?"

		connection.query("SELECT * FROM old_project_web WHERE" + where_clause, parent_id, async (err, row_projects) => {
			if (err || !row_projects) return reject(err);

			let await_all_rows = row_projects.map(async (item, index) => {
				// making the javascript :/
				let child_row_data = await pull_all_data(item.id, level + 1);
				return_array.push("<div class='old-project-web " + level + "'>" +
					(item.type == "button" ? ("<button class='menu-button' id='open-child||'"
						/* NEED LINK*/ + ">" + item.title + "</button>") :
					item.type == "background_change" ? ("<button class='menu-button'" +
					" id='open-new-render||'>" + item.title + "</button>") : ("<a href='" +
					/* NEED LINK */ + "</a>")) + (child_row_data.length ? "<div class='children-project-web'>" + 
					child_row_data.toString().replace(/,/g, "") +
					"</div>" : "") + "</div>");
			});
			await Promise.all(await_all_rows);
			resolve(return_array);
		});
	});
}

app.get("/", async (req, res) => {
	// set up project object with all of the old projects
	let old_project_obj;
	let count_up = 0;

	old_project_obj = await pull_all_data(null, count_up);
	console.log(old_project_obj);

	res.render("front_page", {
		NAME: "Charlie Hall",
		PROFILE_WORDS: [{
			PROFILE_WORD: "first test?"
		}, {
			PROFILE_WORD: "second test!"
		}],
		SPIDER_WEB: old_project_obj
	});
});

app.listen(9988, () => {
	console.log("server go vroom");
});