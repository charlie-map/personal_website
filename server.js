require('dotenv').config({
	path: __dirname + "/.env"
});
const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');
const mysql = require('mysql2');
const {
	v4: uuidv4
} = require('uuid');

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
function pull_all_old_projects(parent_id, tree_path_value, level) {
	let return_array = "";
	let svg_path = [];
	return new Promise((resolve, reject) => {
		let where_clause = !parent_id ? " parent_id IS NULL" : " parent_id=?"

		connection.query("SELECT * FROM old_project_web WHERE" + where_clause, parent_id, async (err, row_projects) => {
			if (err || !row_projects) return reject(err);

			let await_all_rows = row_projects.map(async (item, index) => {
				if (level == 0) {
					item.tree_sub_value = index + 1;
					svg_path.push({ SVG_NAME: item.tree_sub_value, ROW_LINES: [] });
				} else item.tree_sub_value = tree_path_value;
				// making the javascript :/
				let child_row_data = await pull_all_old_projects(item.id, item.tree_sub_value, level + 1);
				let this_id = uuidv4();
				return_array += "<div class='old-project-web " + item.tree_sub_value + "'>" +
					(item.type == "button" ? ("<button class='project-web-open-child' id='open-child||" + item.tree_sub_value + "||" + this_id + "||" + level + "'" +
							">" + item.title + "</button>") :
						item.type == "background_change" ? ("<button class='project-web-open-child'" +
							" id='open-new-render||" + item.tree_sub_value + "||" + this_id + "||" + level + "'>" + item.title + "</button>") : ("<a href='" +
							/* NEED LINK */
							+"</a>")) + (child_row_data[0].length ? "<div class='children-project-web'>" +
						child_row_data[0].toString().replace(/,/g, "") +
						"</div>" : "") + "</div>";

				if (level == 0) svg_path[index].ROW_LINES.push(...child_row_data[1], { CHILD_ELEMENT_NAME: this_id });
				else svg_path.push(...child_row_data[1], { CHILD_ELEMENT_NAME: this_id });
			});
			await Promise.all(await_all_rows);
			resolve([return_array, svg_path.length ? svg_path : []]);
		});
	});
}

app.get("/", async (req, res) => {
	// set up project object with all of the old projects
	let old_project_obj;

	// grabs all projects from database, creates recursive div and
	// adds all the data into svg, which is used for line drawing
	old_project_obj = await pull_all_old_projects(null, 0, 0);
	let svg_obj = old_project_obj.splice(1)[0];

	res.render("front_page", {
		NAME: "Charlie Hall",
		PROFILE_WORDS: [{
			PROFILE_WORD: "first test?"
		}, {
			PROFILE_WORD: "second test!"
		}],
		SPIDER_WEB: old_project_obj[0].toString().replace(/,/g, ""),
		SVG_ROWS: svg_obj,
		CHOICE_SCRIPT: "hex.js"
	});
});

app.listen(9988, () => {
	console.log("server go vroom");
});