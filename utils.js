require('dotenv').config({
	path: __dirname + "/.env"
});
const mysql = require('mysql2');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const {
	v4: uuidv4
} = require('uuid');
const morgan = require('morgan');

const connection = mysql.createConnection({
	host: process.env.HOST,
	database: process.env.DATABASE,
	user: process.env.USER_NAME,
	password: process.env.PASSWORD,
	insecureAuth: false,
	multipleStatements: true
});

connection.connect((err) => {
	if (err) throw err;
});

/*
	a fancy little function which takes in a length of an array, and a wanted length
	and returns an array of random values for accessing the array in the current_array_length

	ex.
	array = [12,34,35,75]

	current_array_length = 4
	wanted_length = 2

	returns: [75,34]

----other than the case I use it in, not sure why it is necessary :P
*/
function get_random_values(current_array_length, wanted_length) {
	let values = [];
	if (current_array_length <= wanted_length) {
		for (let run_through = 0; run_through < current_array_length; run_through++)
			values.push(run_through);

		return values;
	} else {
		for (let run_through = 0; run_through < wanted_length; run_through++) {
			let random_value;

			do {
				random_value = Math.floor(Math.random() * current_array_length);
			} while (values.includes(random_value));

			values.push(random_value);
		}

		return values;
	}
}

function pull_current_profile_words() {
	return new Promise((resolve, reject) => {
		connection.query("SELECT * FROM user_info_profile_words", (err, all_words) => {
			if (err || !all_words) reject(err);

			all_words.forEach(word => {
				word.PROFILE_WORD = word.profile_word;
				word.ID = word.id;

				word.PROFILE_WORD.replace(/ /g, "-");
				word.PROFILE_WORD = word.PROFILE_WORD.length > 8 ? [word.PROFILE_WORD.substring(0, 8), word.PROFILE_WORD.substring(8)].join("-") : word.PROFILE_WORD;
			});

			let grab_three = get_random_values(all_words.length, 3);
			let return_words = [];
			grab_three.forEach(number => {
				return_words.push(all_words[number]);
			});

			resolve(return_words);
		});
	});
}

/*
	Pull different information needed:
	currently only for image location dot on the page
*/
function about_me_settings() {
	return new Promise((resolve, reject) => {
		connection.query("SELECT * FROM user_info_values", (err, all_values) => {
			if (err || !all_values) return reject(err);

			let return_array = [];

			all_values.forEach(value => {
				return_array.push(`let ${value.variable_name} = ${(typeof value.value == "string") ? "\`" + value.value + "\`" : value.value}`);
			});

			resolve(return_array);
		});
	});
}

function about_me_home_base() {
	return new Promise((resolve, reject) => {
		connection.query("SELECT home_base_image, home_base_city, home_base_state_country FROM user", (err, values) => {
			if (err || !values) return reject(err);

			resolve(values);
		});
	});
}

// go through the root objects recursively
function pull_all_old_projects(parent_id, tree_path_value, level) {
	let return_array = "";
	let svg_path = [];
	let needed_classes = [];
	let depth = level;
	return new Promise((resolve, reject) => {
		let where_clause = !parent_id ? " parent_id IS NULL" : " parent_id=?"

		connection.query("SELECT * FROM old_project_web WHERE" + where_clause, parent_id, async (err, row_projects) => {
			if (err || !row_projects) return reject(err);

			let await_all_rows = row_projects.map(async (item, index) => {
				if (level == 0) {
					item.tree_sub_value = index + 1;
					svg_path.push({
						SVG_NAME: item.tree_sub_value,
						ROW_LINES: []
					});
				} else item.tree_sub_value = tree_path_value;
				// making the javascript :/
				let child_row_data = await pull_all_old_projects(item.id, item.tree_sub_value, level + 1);
				depth = child_row_data[3];
				let this_id = uuidv4();

				let id_conc_level = this_id + "_" + level + "_" + item.parent_id + "_" + item.tree_sub_value;
				let icon_item_title = item.title.replace(/ /g, "").replace(/[']/g, "&#39;");
				return_array += "<div class='old-project-web " + item.tree_sub_value + "'>" +
					(item.type == "button" ?
						(`<button class='project-web-open-child' id='open-child||${item.tree_sub_value}||${this_id}||${level}'><p id=${item.id}>${item.title}</p><div class='tooltip'>` +
							`<ion-icon title='delete' id='${icon_item_title}_${id_conc_level}_open-child' name='trash-outline'></ion-icon>` +
							`<ion-icon title='rename' id='${icon_item_title}_${id_conc_level}_open-child' name='clipboard-outline'></ion-icon>` +
							`<ion-icon title='add' id='${icon_item_title}_${id_conc_level}_open-child' name='add-circle-outline'></ion-icon>` +
							`<div id='display-icon-descript${icon_item_title + this_id}'></div>` +
							"</div></button>") : item.type == "background_change" ?
						("<button class='project-web-open-child option-background'" +
							` id='open-new-render||${item.tree_sub_value}||${this_id}||${level}||${item.project_link}'><p id=${item.id}>${item.title}</p><div class='tooltip'>` +
							`<ion-icon title='delete' id='${icon_item_title}_${id_conc_level}_open-new-render' name='trash-outline'></ion-icon>` +
							`<ion-icon title='rename' id='${icon_item_title}_${id_conc_level}_open-new-render' name='clipboard-outline'></ion-icon>` +
							"<div id='display-icon-descript" + icon_item_title + this_id + "'></div>" +
							"</div></button>") :
						(
							`<button class='project-web-open-child info-link'
							id='open-new-link||${item.tree_sub_value}||${this_id}||${level}||${item.project_link}'
							${await grabLinkDescript(item.id)}><p id=${item.id}>${item.title}</p><div class='tooltip'>
							<ion-icon title='delete' id='${icon_item_title}_${id_conc_level}_open-new-render' name='trash-outline'></ion-icon>
							<ion-icon title='rename' id='${icon_item_title}_${id_conc_level}_open-new-render' name='clipboard-outline'></ion-icon>
							<div id='display-icon-descript" + icon_item_title + this_id + "'></div>
							</div></button>`
						)) + (child_row_data[0].length ? "<div class='children-project-web'>" +
						child_row_data[0].toString().replace(/,/g, "") +
						"</div>" : "") + "</div>";
				needed_classes.push(...child_row_data[2]);
				if (item.class_needed) {
					let project_classes = item.project_link.split('.');

					for (let i = 0; i < project_classes.length - 1; i++) {
						needed_classes.push("let " + item.project_link.split('.')[i] + " = [];");
					}
				}

				if (level == 0) svg_path[index].ROW_LINES.push(...child_row_data[1], {
					CHILD_ELEMENT_NAME: this_id
				});
				else svg_path.push(...child_row_data[1], {
					CHILD_ELEMENT_NAME: this_id
				});
			});
			await Promise.all(await_all_rows);
			resolve([return_array, svg_path.length ? svg_path : [], needed_classes, depth]);
		});
	});
}

function grabLinkDescript(ID) {
	if (!ID)
		return;

	return new Promise((resolve) => { // an injection...
		connection.query("SELECT * FROM link_project_description WHERE project_id=?", ID, (err, ans) => {
			if (err) console.log(err);

			if (ans.length)
				return resolve(`description="${ans[0].descript}" github_link="${ans[0].github_link}" online_link="${ans[0].online_link}"`);
			else
				return resolve("");// send nothing
		});
	});
}

module.exports = {
	connection,
	mustache,
	bodyParser,
	pull_all_old_projects,
	pull_current_profile_words,
	about_me_settings,
	about_me_home_base,
	uuidv4,
	morgan
};