# codaisseur-week5-day3-buildingRestApi

Building a REST API
To build a RESTful JSON API with Express, we have to do the following:

-Implement the basic CRUD (create, read, update and delete) actions -using the appropriate HTTP methods.
-Respond with the correct status codes.
-Parse the HTTP request body, when necessary, and use it accordingly.
-Define routes that satisfy the REST constraints.
-Persist the data (in most cases, anyway).

Exercise1: Connect and create tables

1. Create a new Node.js project and install the following dependencies:
   --in Terminal: npm init
   --npm install sequelize pg
   pg@7.9.0
   sequelize@5.10.1
2. Start a PostgreSQL database on your development machine.
   -- run docker from application.
   -- in Terminal:
   docker ps -a : to test if docker is connected
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=mypassword postgres
   -- run PSequel and connect to your postgres instance

3. Create an index.js (db.js) file and include the two previous snippets:
   const Sequelize = require("sequelize");
   const sequelize = new Sequelize(
   "postgres://postgres:mypassword@localhost:5432/postgres"
   );
   const User = sequelize.define("user", {
   email: {
   type: Sequelize.STRING,
   allowNull: false,
   unique: true
   }
   });
   const Task = sequelize.define("task", {
   userId: {
   type: Sequelize.INTEGER,
   allowNull: false
   },
   description: {
   type: Sequelize.STRING
   },
   completed: {
   type: Sequelize.BOOLEAN,
   defaultValue: false
   }
   });

sequelize
.sync()
.then(() => console.log("Tables created successfully"))
.catch(err => {
console.error("Unable to create tables, shutting down...", err);
process.exit(1);
});

4. Run the JavaScript program and, using a SQL client, confirm that the tables are created.
   -- in Terminal: node db.js
   -- in PSequel: check that the tables are created.

Exercise2: Setup an Express app

1. Continue with the Node.js project from the previous exercise.
2. Install the following additional dependencies:
   --in Terminal:
   -- npm install express body-parser
   --in VS Code: check package.json to make sure:
   "dependencies": {
   "body-parser": "^1.19.0",
   "express": "^4.17.1",
   "pg": "^7.18.1",
   "sequelize": "^5.21.3"
   }

body-parser@1.18.3
express@4.16.4

3. In your index.js (server.js) create an express app and configure the JSON body-parser middleware at the application level. Remember to call app.listen to start the web server.
4. To test your setup, add the following route:
   app.post('/echo', (req, res) => {
   res.json(req.body)
   })
   Make a POST request to /echo with a JSON body. Confirm that your JSON body is returned (echo'd) in the response.
   -- in Terminal:
   -- --node server.js
   -- in another terminal
   -- --http POST :4000/echo note: use post instead of -v

Exercise3: Create and read users

// Create a new user account
app.post('/users', (req, res, next) => {
User.create(req.body)
.then(user => res.json(user))
.catch(err => next(err))
})

1. Continue with the Node.js project from the previous exercise(server.js).
2. Add the app.post('/users' route (provided above) to your Express app.
3. Make a POST (INSERT QUERY) request to /users with an email and confirm that the data (including id) is returned in the response.
4. Try creating a second user with the same email. Because the email has to be unique in the database, you should see an error in both your application logs as well as the HTTP response.
5. Add a route definition that will respond to GET requests to /users/:userId. Use the User.findByPk() method along with the userId route parameter. Fetch the correct user from the database and return it as a JSON response.
6. Don't forget to catch any errors in the Promise chain.
7. Make some HTTP requests to this new end-point. Try requests with existing user ID's and non-existent ID's. Confirm that both return status 200.
8. Since we should return a 404 when we do not find a requested resource, adjust your code accordingly.
9. Try fetching non-existing users again, and confirm that you now see a 404 status code.
   If you are stuck, or want to see a completed solution, look at this file.

---

---

Exercise4: Implement the "update" action

1. Continue with the Node.js project from the previous exercise.
2. Implement the PUT handler using the snippet as a starting point.

Replace someId and myNewData with the appropriate data from the request. Implement the (currently empty) functions to send the user data back as JSON, and to deal with errors using the built-in error handler.

3. Add code that deals with user being undefined after trying to load it with findByPk. Confirm that updating a non-existent row results in a 404.
