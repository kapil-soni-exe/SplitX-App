require("dotenv").config();
const http = require("http");
const initSocket = require("./src/sockets/index");

const app = require("./src/app");
const server = http.createServer(app);

const connectToDb = require("./src/config/database");

connectToDb();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

initSocket(server);
