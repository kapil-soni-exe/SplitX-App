const express = require("express");
const cookieParser= require("cookie-parser")

const groupRoutes = require("./routes/group.routes");
const authRoutes= require("./routes/auth.routes")
const expenseRoutes = require("./routes/expense.route")
const cors = require("cors");

require("./models/users.model");
require("./models/group.model");
require("./models/expense.model");
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser())

app.use("/api/groups", groupRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/expenses",expenseRoutes)


module.exports = app;
