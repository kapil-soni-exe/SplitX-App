require("dotenv").config();
const http = require("http");
const initSocket = require("./src/sockets/index");

const app = require("./src/app");
const server = http.createServer(app);

const connectToDb = require("./src/config/database");

connectToDb();

server.listen(3000, () => {
  console.log("Server is running");
});

initSocket(server);
