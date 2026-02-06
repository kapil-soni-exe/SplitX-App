const express = require("express");
const groupRoutes = require("./routes/group.routes");
const cors = require("cors");

require("./models/users.model");
require("./models/group.model");
require("./models/expense.model");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/groups", groupRoutes);

module.exports = app;
