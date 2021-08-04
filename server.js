const express = require('express');

const {
	connection,
	mustache,
	bodyParser,
	pull_all_old_projects,
	pull_current_profile_words
} = require('./utils');
const {
	back
} = require('./backend');

const app = express();

app.use('/backend', back);

app.use(express.static(__dirname + "/public"));
app.use("/backend", express.static(__dirname + "/private"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.set('views', __dirname + "/views");
app.set('view engine', 'mustache');
app.engine('mustache', mustache());

app.get("/", async (req, res) => {
	// set up project object with all of the old projects
	let old_project_obj;

	// grabs all projects from database, creates recursive div and
	// adds all the data into svg, which is used for line drawing
	old_project_obj = await pull_all_old_projects(null, 0, 0);
	let height = old_project_obj[3];
	let svg_obj = old_project_obj.splice(1);
	let background_values = svg_obj.splice(1)[0];

	let profile_words = await pull_current_profile_words();

	let max_height = 75 + ((height - 1) * 130);

	res.render("front_page", {
		NAME: "charlie hall",
		PROFILE_WORDS: profile_words,
		SPIDER_WEB: old_project_obj[0].toString().replace(/,/g, ""),
		SVG_ROWS: svg_obj[0],
		CHOICE_SCRIPT: "hex.js",
		PULL_NEEDED_VALUES: background_values.join('\n\t\t\t'),
		HEIGHT: max_height + "px"
	});
});

app.get("/*", (req, res) => {
	res.redirect("/");
});

app.listen(9988, () => {
	console.log("server go vroom");
});