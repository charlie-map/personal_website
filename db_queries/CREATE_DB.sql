DROP DATABASE IF EXISTS my_site;
CREATE DATABASE my_site;
USE my_site;

CREATE USER 'your username'@'your host name' IDENTIFIED BY 'your password here';
GRANT SELECT ON my_site.* TO 'your username'@'your host name';
FLUSH PRIVILEGES;