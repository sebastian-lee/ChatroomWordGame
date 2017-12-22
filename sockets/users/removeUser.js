function removeUser(addedUser, socket, io, room, userList) {
  if (addedUser) {
    console.log("user disconnected");
    username = userList.users[socket.id].username;

    io.to(room).emit("user disconnected", username);
    //Subtract user list length
    if (userList.length > 0) {
      userList.length--;
    }
    let userIndex = userList.order.indexOf(socket.id);
    if (userIndex != -1) {
      userList.order = userList.order
        .slice(0, userIndex)
        .concat(userList.order.slice(userIndex + 1));
    }
    delete userList.users[socket.id];
  }
}

module.exports = removeUser;
