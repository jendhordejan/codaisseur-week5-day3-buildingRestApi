const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 4000;

const { User, Task } = require("./db");

// parse application/json
app.use(bodyParser.json()); // configure the bodyParser Middleware in the application level

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({
    message: "We received your request body!"
  });
});

// just using this endpoint for testing
app.post("/echo", (req, res) => {
  res.json(req.body);
});

// Exercise3: Create and read users
// to test this:
//           node server.js -- run/restart the server
//           http POST :4000/users email=someone@gmail.com
// 4. run the same POST: http POST :4000/users email=someone@gmail.com to test the constraint error... this is because of "unique: true" defined in the db table mapping.
// Creating a new user
app.post("/users", (req, res, next) => {
  User.create(req.body)
    .then(user => res.json(user))
    .catch(err => next(err));
});

//for fetching all data from User table and displaying it.
// to test this:
//          node server.js -- run/restart the server
//          http :4000/users
// Getting all user data
app.get("/users", (req, res, next) => {
  User.findAll().then(users => res.json(users));
});

// 5. Add a route definition that will respond to GET requests to /users/:userId.
//       Use the User.findByPk() method along with the userId route parameter.
//       Fetch the correct user from the database and return it as a JSON response.
// to test this:
//          node server.js -- run/restart the server
//          http :4000/users/1 -> should display the first row of the user table
//          6,8 and 9. http :4000/users/100 -> should display 'user not found'
// Getting one user data by primary key
app.get("/users/:id", (req, res, next) => {
  const userId = parseInt(req.params.id);
  User.findByPk(userId).then(user => {
    if (!user) {
      res.status(404).send("user not found!"); //8.  404 when we do not find a requested resource
    } else {
      res.json(user);
    }
  });
});

// Exercise4: Implement the "update" action (PUT)
// Update a user's information
app.put("/users/:userId", (req, res, next) => {
  User.findByPk(req.params.userId)
    .then(user => {
      if (user) {
        //----- 2. Replacing myNewData with appropriate data from the request.
        user.update(req.body).then(user => res.json(user)); //test this: http PUT :4000/users/1 email=a_person@gmail.com
      } else {
        res.status(404).end(); // 3. Confirm that updating a non-existent row results in a 404.
      }
    })
    .catch(next);
});
// EXTRA:
// Delete a user record
// to test this:
//        http DELETE :4000/users/1 (204-ok)
//        http DELETE :4000/users/1 (run again to test for 404)
app.delete("/users/:userId", (req, res, next) => {
  User.destroy({
    where: {
      id: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Create a new task
// to test this:
//        http POST :4000/users/2/tasks userId=2 description='task 2' completed=false
app.post("/users/:userId/tasks", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  User.findByPk(userId)
    .then(user => {
      if (!user) {
        res.status(404).end();
      } else {
        Task.create({
          ...req.body,
          userId: userId
        }).then(task => {
          res.json(task);
        });
      }
    })
    .catch(next);
});

// Get all user's tasks
// to test this:
//      http :4000/users/2/tasks
app.get("/users/:userId/tasks", (req, res, next) => {
  const userId = parseInt(req.params.userId);
  Task.findAll({ where: { userId: userId } })
    .then(tasks => {
      res.json(tasks);
    })
    .catch(next);
});

// Get a single user task
// to test this:
//      http :4000/users/1/tasks/1
//      http :4000/users/2/tasks/3
app.get("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        res.json(task);
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Update an existing task
// to test this:
//      http PUT :4000/users/1/tasks/1 description='task1 description'
//      http PUT :4000/users/1/tasks/1 description='task1 description again' completed=true
app.put("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.findOne({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(task => {
      if (task) {
        task.update(req.body).then(task => res.json(task));
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete a user's task
//       http DELETE :4000/users/1/tasks/1 (204-ok)
//       http DELETE :4000/users/1/tasks/1 (run again to test 404)
app.delete("/users/:userId/tasks/:taskId", (req, res, next) => {
  Task.destroy({
    where: {
      id: req.params.taskId,
      userId: req.params.userId
    }
  })
    .then(numDeleted => {
      if (numDeleted) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(next);
});

// Delete all user's tasks
//      http DELETE :4000/users/2/tasks
app.delete("/users/:userId/tasks", (req, res, next) => {
  Task.destroy({
    where: {
      userId: req.params.userId
    }
  })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
});

app.listen(port, () => console.log("listening on port " + port));
