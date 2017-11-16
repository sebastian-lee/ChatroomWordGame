function removeUser(addedUser, socket, io, userList) {
  if (addedUser) {
    console.log("user disconnected");
    username = userList.users[socket.id].username;

    io.emit("user disconnected", username);
    //Subtract user list length
    if (userList.length > 0) {
      userList.length--;
    }
    delete userList.users[socket.id];
  }
}

module.exports = removeUser;