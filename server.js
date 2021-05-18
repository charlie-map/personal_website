const express = require('express');
const bodyParser = require('body-parser');
const mustache = require('mustache-express');

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