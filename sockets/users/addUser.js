var sendTargetUser = require("../updates/update.js").sendTargetUser;
var sendTargetWord = require("../updates/update.js").sendTargetWord;

var getRandomTargetUser = require("../util/random.js").getRandomTargetUser;
var getRandomTargetWord = require("../util/random.js").getRandomTargetWord;

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
    //Give user a target word and target user
    targetWord: getRandomTargetWord(),
    //Pick a random user from list of clients, if no one else, put on waiting list for new players.
    targetUserID: getRandomTargetUser(socket.id, userList, waitingForTarget),
    score: 0
  };

  //Send the target word and user to the client
  sendTargetWord(socket.id, io, userList);
  //If there is a target userID emit to client
  if (userList.users[socket.id].targetUserID != null) {
    sendTargetUser(socket.id, io, userList);
  }
  return true;
}

module.exports = addUser;
