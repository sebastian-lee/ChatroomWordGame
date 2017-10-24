//Import from Utils
var getRandomTargetUser = require("./util/random.js").getRandomTargetUser;
var getRandomTargetWord = require("./util/random.js").getRandomTargetWord;

//Import from Updates
var sendTargetUser = require("./updates/update.js").sendTargetUser;
var sendTargetWord = require("./updates/update.js").sendTargetWord;
var sendUserList = require("./updates/update.js").sendUserList; 

//Import from Checks
var checkWaitingList = require("./checks/check.js").checkWaitingList;
var checkForTargetWord = require("./checks/check.js").checkForTargetWord; 

//Import from Users
var addUser = require("./users/addUser.js");
var removeUser = require("./users/removeUser.js");

module.exports = function(io) {
  //User List
  var userList = {
    length: 0,
    users: {}
  };

  //List of waiting socket ids
  var waitingForTarget = [];

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
      if (addUser(addedUser, socket, io, username, userList, waitingForTarget)) {
        addedUser = true;
        //Check if anyone is on the waiting list and give them a target
        checkWaitingList(userList, waitingForTarget, io);
        socket.emit("logged in", true);
        
        //send updated userlist
        sendUserList(io, userList);
      }
    });

    //User has left
    //Remove the user from the list of users
    socket.on("disconnect", () => {
      //Remove User from userlist
      waitingForTarget = removeUser(addedUser, socket, io, userList, waitingForTarget);

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
      sendUserList(io, userList);
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
