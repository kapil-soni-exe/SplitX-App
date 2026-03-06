// group related socket events

function groupSocketHandler(socket){
 socket.on("join-group",(groupId)=>{
    socket.join(groupId)
    console.log("User",socket.user.id,"joining",groupId);
 })
 socket.on("leave-group", (groupId) => {
    socket.leave(groupId);
    console.log("User", socket.user.id, "left", groupId);
  });
}


module.exports = groupSocketHandler