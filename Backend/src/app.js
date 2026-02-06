const express = require("express");
const cookieParser= require("cookie-parser")

const groupRoutes = require("./routes/group.routes");
const authRoutes= require("./routes/auth.routes")
const cors = require("cors");

require("./models/users.model");
require("./models/group.model");
require("./models/expense.model");
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser())

app.use("/api/groups", groupRoutes);
app.use("/api/auth",authRoutes)

module.exports = app;
