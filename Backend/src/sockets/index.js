const {Server} = require("socket.io")
const groupSocketHandler = require("./handlers/groups.socket");
const socketAuth = require("./middleware/socketAuth")
const {setIO} = require("./socketManager")

function initSocket(server){
  const io = new Server(server,{
    cors:{
      origin: true,
      credentials:true
    }
  })

  setIO(io)

  // authentication middleware
  io.use(socketAuth);

  io.on("connection",(socket)=>{
    console.log("User Connected",socket.user.id)

     groupSocketHandler(socket);
  })
}

module.exports = initSocket