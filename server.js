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

app.get("/", (req, res) => {
	res.render("front_page");
});

app.get("/go-to-page/:page", (req, res) => {

});

app.listen(9988, () => {
	console.log("server go vroom");
});