/* Some initial insertion data for usage - may need changes based on what the needs of this website are for */
USE my_site;

INSERT INTO user (username, password, home_base_image, home_base_background_info, home_base_city, home_base_state_country) VALUES (
	"charlie-map",
	"password",
	"https://upload.wikimedia.org/wikipedia/commons/f/f5/Virginia_map.png",
	"there is no information on this place.",
	"charlottesville",
	"virginia"
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

INSERT INTO old_project_web (title, parent_id, type) VALUES (
	"water4u",
	7,
	"link"
);

INSERT INTO link_project_description (project_id, descript, github_link, online_link) VALUES (
	19,
	"before the summer of 2020, another student and i worked on this project for registration at a summer camp called summer spark. this was a major milestone in my software development work. i also worked at the camp for 3 weeks as the lead instructor and director of vounteers.",
	"https://github.com/Spark-Hackathon/registration",
	"https://summerspark.stab.org/"
);

INSERT INTO link_project_description VALUES (

);

INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAP_WIDTH", 30);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAXIMUM_WIDTH", 160);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAP_HEIGHT", 30);
INSERT INTO user_info_values VALUES ("IMG_LOCATION_MAXIMUM_HEIGHT", 100);