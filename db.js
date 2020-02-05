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

module.exports = { User, Task };
