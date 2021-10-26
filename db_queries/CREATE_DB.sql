DROP DATABASE IF EXISTS my_site;
CREATE DATABASE my_site;
USE my_site;

CREATE TABLE user (
	id INT AUTO_INCREMENT,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(60) NOT NULL,
	home_base_image VARCHAR(511),
	home_base_city VARCHAR(255) DEFAULT "classified",
	home_base_state_country VARCHAR(255) DEFAULT "information",
	home_base_background_info TEXT DEFAULT "there is no available information on this place.",
	PRIMARY KEY (id)
);

CREATE TABLE old_project_web (
	id INT AUTO_INCREMENT,
	parent_id INT DEFAULT NULL,
	title VARCHAR(255) DEFAULT "Unknown",
	type VARCHAR(255),
	completion_date DATETIME DEFAULT NULL,
	project_link VARCHAR(511) DEFAULT NULL,
	class_needed TINYINT(1) DEFAULT 0,
	PRIMARY KEY (id),
	FOREIGN KEY (parent_id) REFERENCES old_project_web (id) ON DELETE CASCADE
);

/* TYPE:
	type is a assignment to one of three thing (currently):
		1. button - for opening parts of tree: called `open-child`
		2. different page (on website) - displaying different background on page:
			called `background_change`
		3. a link to another page (e.g. https://glitch.com)
*/

CREATE TABLE link_project_description (
	project_id INT NOT NULL,
	github_link TEXT NOT NULL,
	online_link TEXT,
	descript TEXT NOT NULL,
	FOREIGN KEY (project_id) REFERENCES old_project_web (id) ON DELETE CASCADE
);

/* DESCRIPT:
	this will be an HTML page that connects with a certain descriptor
*/

CREATE TABLE user_info_profile_words (
	id INT AUTO_INCREMENT,
	profile_word VARCHAR(60) NOT NULL,
	PRIMARY KEY(id)
);

/* user_info_values:
	used for storing some variables that may be needed in the program
*/
CREATE TABLE user_info_values (
	variable_name VARCHAR(255) NOT NULL,
	value VARCHAR(255) NOT NULL
);

/* interest_spec:
	holds the people interested in reaching out to a user:
*/
CREATE TABLE interest_spec (
	interest_email VARCHAR(255) NOT NULL UNIQUE,
	interest_name VARCHAR(255) NOT NULL,
	interest_note TEXT 
);