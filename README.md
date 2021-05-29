# personal website

A lazy Summer activity to get ready for the big senior year.

----------------------------------------------------------------------------------

# installing

First create a .env file to use when running the program:
* `HOST="your host name"`
* `DATABASE="my_site"`
* `USER_NAME="your username"`
* `PASSWORD="your password here"`

The run the following calls to create the database:
* `sudo mysql -u root < db_queries/CREATE_DB.sql`
* `sudo mysql -u root < db_queries/DATA.sql`

The start the program with `node server.js` and you're good to go!
