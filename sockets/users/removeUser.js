function removeUser(addedUser, socket, io, userList, waitingForTarget) {
  if (addedUser) {
    console.log("user disconnected");
    username = userList.users[socket.id].username;

    waitingForTarget.filter((user,index) => {
      //Look for disconnected user if he is on the waitingList and remove him
      if(user == socket.id){
        
        waitingForTarget = waitingForTarget.slice(0,index).concat(waitingForTarget.slice(index+1));
      }
    });

    io.emit("user disconnected", username);
    if (userList.length > 0) {
      userList.length--;
    }
    delete userList.users[socket.id];
    console.log(waitingForTarget, userList);
    return waitingForTarget;
  }
}

module.exports = removeUser;