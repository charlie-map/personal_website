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
				let icon_item_title = item.title.replace(/ /g, "");
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
							"</div></button>") : ("<a href='" +
							/* NEED LINK */
							+"</a>")) + (child_row_data[0].length ? "<div class='children-project-web'>" +
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

module.exports = {
	connection,
	mustache,
	bodyParser,
	pull_all_old_projects,
	uuidv4,
	morgan
};