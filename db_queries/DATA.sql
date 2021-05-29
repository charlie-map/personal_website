/* Some initial insertion data for usage - may need changes based on what the needs of this website are for */
USE my_site;

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