//Import from Utils
var getRandomTargetUser = require("./util/random.js").getRandomTargetUser;
var getRandomTargetWord = require("./util/random.js").getRandomTargetWord;

//Import from Updates
var sendTargetUser = require("./updates/update.js").sendTargetUser;
var sendTargetWord = require("./updates/update.js").sendTargetWord;
var sendUsernameList = require("./updates/update.js").sendUsernameList; 

//Import from Checks
var checkUniqueUsername = require("./checks/check.js").checkUniqueUsername;
var checkWaitingList = require("./checks/check.js").checkWaitingList;
var checkForTargetWord = require("./checks/check.js").checkForTargetWord; 

module.exports = function(io) {
  //User List
  var userList = {
    length: 0,
    users: {}
  };

  //List of waiting socket ids
  var waitingForTarget = [];

  function addUser(addedUser, socket, username) {
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
      targetUserID: getRandomTargetUser(socket.id, userList, waitingForTarget)
    };

    //Send the target word and user to the client
    sendTargetWord(socket.id, io, userList);
    //If there is a target userID emit to client
    if (userList.users[socket.id].targetUserID != null) {
      sendTargetUser(socket.id, io, userList);
    }
    return true;
  }

  function removeUser(addedUser, socket) {
    if (addedUser) {
      console.log("user disconnected");
      username = userList.users[socket.id].username;
      io.emit("user disconnected", username);
      if (userList.length > 0) {
        userList.length--;
      }
      delete userList.users[socket.id];
    }
  }

  io.on("connection", socket => {
    //New user connection
    //keep track if this user has been added
    let addedUser = false;
    /*
     * Add the new user to the list of users
     * with a unique name 
     */

    socket.on("add username", function(username) {
      //Sanitize username
      username = String(username);
      console.log("new username " + username);
      if (addUser(addedUser, socket, username)) {
        addedUser = true;
        //Check if anyone is on the waiting list and give them a target
        checkWaitingList(userList, waitingForTarget, io);
        socket.emit("logged in", true);
        //send updated userlist
        sendUsernameList(io, userList);
      }
    });

    //User has left
    //Remove the user from the list of users
    socket.on("disconnect", () => {
      //Remove User from userlist
      removeUser(addedUser, socket);

      //Check if any of the names was a targeted user
      //Replace any found with a new target
      for (user in userList.users) {
        const userID = user;
        if (userList.users[userID].targetUserID == socket.id) {
          userList.users[userID].targetUserID = getRandomTargetUser(
            userID,
            userList,
            waitingForTarget
          );
          userList.users[userID].targetWord = getRandomTargetWord(
            userList.users[userID].targetWord
          );
          sendTargetUser(userID, io, userList);
          sendTargetWord(userID, io, userList);
        }
      }

      //send updated userlist
      sendUsernameList(io, userList);
    });

    socket.on("chat message", function(msg) {
      //Sanitize msg
      msg = String(msg);

      //Check through user list for target words and users
      if (addedUser) {
        checkForTargetWord(msg, socket, userList, waitingForTarget, io);
        //Emit message to chatroom
        io.emit("chat message", {
          username: userList.users[socket.id].username,
          msg
        });
      }
    });

    socket.on("typing", function() {
      let username = userList.users[socket.id].username;
      io.emit("typing", username);
    });

    socket.on("stop typing", function() {
      let username = userList.users[socket.id].username;
      io.emit("stop typing", username);
    });

    socket.on("error", function(err) {
      console.log(err);
    });
  });
};
