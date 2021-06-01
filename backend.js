require('dotenv').config({
	path: __dirname + "/.env"
});
const express = require('express');
const {
	connection
} = require('./utils');

const back = express.Router();

back.get("/*", (req, res) => {
	res.render("back_page", {
		NAME: "charlie hall"
	});
});

module.exports = {
	back
};