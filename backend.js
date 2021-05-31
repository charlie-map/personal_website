require('dotenv').config({
	path: __dirname + "/.env"
});
const express = require('express');
const {
	connection
} = require('utils.js');

const back = express.Router();