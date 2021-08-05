/* Some initial insertion data for usage - may need changes based on what the needs of this website are for */
USE my_site;

INSERT INTO user (username, password) VALUES (
	"charlie-map",
	"password"
);

/* An important note: parents must always be a button*/
INSERT INTO old_project_web (title, type) VALUES (
	"algorithms",
	"button"
);

INSERT INTO old_project_web (title, type) VALUES (
	"web development",
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"fun",
	1,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"school",
	1,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"fun",
	2,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"freelance",
	2,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"school",
	2,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"c projects",
	3,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"sorting",
	3,
	"button"
);

INSERT INTO old_project_web (title, parent_id, type, project_link, class_needed) VALUES (
	"random walker",
	4,
	"background_change",
	"walker.js",
	1
);

INSERT INTO old_project_web (title, parent_id, type, project_link, class_needed) VALUES (
	"hexagons",
	3,
	"background_change",
	"hex.js",
	1
);

INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAP_WIDTH", 30);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAXIMUM_WIDTH", 160);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAP_HEIGHT", 30);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAXIMUM_HEIGHT", 100);