//Import from Checks
var checkUniqueUsername = require("../checks/check.js").checkUniqueUsername;

function addUser(addedUser, socket, io, username, userList, waitingForTarget) {
  //If the user is already added return
  if (addedUser) {
    console.log("User already added");
    return false;
  }

  if (!checkUniqueUsername(socket, username, userList)) {
    socket.emit("not unique username");
    return false;
  }

  console.log("a user connected");
  io.emit("user connected", username);
  userList.length++;

  userList.users[socket.id] = {
    username: username,
    score: 0,
    role: "",
    attempts: 0
  };

  return true;
}

module.exports = addUser;
