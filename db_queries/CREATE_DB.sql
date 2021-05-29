DROP DATABASE IF EXISTS my_site;
CREATE DATABASE my_site;
USE my_site;

CREATE TABLE old_project_web (
	id INT AUTO_INCREMENT,
	parent_id INT DEFAULT NULL,
	title VARCHAR(255) DEFAULT "Unknown",
	type VARCHAR(255),
	PRIMARY KEY (id),
	FOREIGN KEY (parent_id) REFERENCES old_project_web (id) ON DELETE CASCADE
);

/* TYPE:
	type is a assignment to one of three thing (currently):
		1. button
		2. different page (on website)
		3. a link to another page (e.g. https://glitch.com)
*/