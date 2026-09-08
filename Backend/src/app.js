const express = require("express");
const cookieParser= require("cookie-parser")

const groupRoutes = require("./routes/group.routes");
const authRoutes= require("./routes/auth.routes")
const expenseRoutes = require("./routes/expense.route")
const settlementRoutes = require("./routes/settlement.routes")
const profileRoutes = require("./routes/profile.routes")
const cors = require("cors");


const app = express();
app.use(express.json());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser())

app.use("/api/groups", groupRoutes);
app.use("/api/auth",authRoutes)
app.use("/api/expenses",expenseRoutes)
app.use("/api/groups",settlementRoutes)
app.use("/api/profile",profileRoutes)

// Global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;
