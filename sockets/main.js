//Import from Utils
var getRandomTargetUser = require("./util/random.js").getRandomTargetUser;
var getRandomTargetWord = require("./util/random.js").getRandomTargetWord;
var getRandomRoles = require("./util/random.js").getRandomRoles;
var getRandomPassword = require("./util/random.js").getRandomPassword;

//Import from Updates
var sendTargetUser = require("./updates/update.js").sendTargetUser;
var sendTargetWord = require("./updates/update.js").sendTargetWord;
var sendUserList = require("./updates/update.js").sendUserList;
var sendHalfOfPass = require("./updates/update.js").sendHalfOfPass;

//Import from Checks
var checkWaitingList = require("./checks/check.js").checkWaitingList;
var checkForTargetWord = require("./checks/check.js").checkForTargetWord;
var checkPassword = require("./checks/check.js").checkPassword;
var findSpies = require("./checks/find.js").findSpies;
var findLiar = require("./checks/find.js").findLiar;

//Import from Users
var addUser = require("./users/addUser.js");
var removeUser = require("./users/removeUser.js");

//Player Count
const REQUIRED_PLAYERS = 5;
const SPY_AMOUNT = 2;
const DETECTIVE_AMOUNT = 2;
const LIAR_AMOUNT = 1;

//Attempts
const DETECTIVE_ATTEMPT_AMOUNT = 3;
const SPY_ATTEMPT_AMOUNT = 3;
const LIAR_ATTEMPT_AMOUNT = 2;

//Minutes
const GAME_LENGTH = 5;

module.exports = function(io) {
  //User List
  var userList = {
    length: 0,
    password: [],
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

    function applyRoleAttempts(
      userList,
      detectiveAttempts,
      spyAttempts,
      liarAttempts
    ) {
      for (let user in userList.users) {
        role = userList.users[user].role;
        switch (role) {
          case "detective":
            userList.users[user].attempts = detectiveAttempts;
            break;
          case "spy":
            userList.users[user].attempts = spyAttempts;
            break;
          case "liar":
            userList.users[user].attempts = liarAttempts;
            userList.users[user].whoGuessedMe = [];
            break;
          default:
            console.log(`${role} is not a role`);
        }
      }
    }

    socket.on("add username", function(username) {
      //Do not let more than the required amount join
      if (userList.length >= REQUIRED_PLAYERS) {
        console.log("Enough Players have joined.");
        return;
      }

      //Sanitize username
      username = String(username);
      console.log("new username " + username);

      if (
        addUser(addedUser, socket, io, username, userList, waitingForTarget)
      ) {
        addedUser = true;
        //Check if anyone is on the waiting list and give them a target
        checkWaitingList(userList, waitingForTarget, io);
        socket.emit("logged in", true);
        socket.emit("my username", username);
        //send updated userlist
        sendUserList(io, userList);

        console.log(`There are ${userList.length} players.`);
        if (userList.length < REQUIRED_PLAYERS) {
          console.log("Waiting for more players to join");
        } else {
          //Start Game
          console.log(`There are enough players. Starting Game.`);
          getRandomRoles(userList);
          console.log(userList.users);

          //Send roles to each player
          for (user in userList.users) {
            let role = userList.users[user].role;
            io.to(user).emit("my role", role);
          }
          //Apply number attempts for each role
          applyRoleAttempts(
            userList,
            DETECTIVE_ATTEMPT_AMOUNT,
            SPY_ATTEMPT_AMOUNT,
            LIAR_ATTEMPT_AMOUNT
          );
          console.log(userList);

          console.log("Generating Password");
          getRandomPassword(userList.password);
          console.log(`Password is ${userList.password}`);
          //Send half of password to the two spies
          sendHalfOfPass(io, userList, userList.password);

          //Start Timer
          let startTime = Date.now();
          let endTime = startTime + GAME_LENGTH * 60 * 1000;
          let timer = setInterval(function() {
            let now = Date.now();
            let timeElasped = now - startTime;
            let timeLeft = endTime - now;
            if (now > endTime) {
              console.log("Time is up.");
              clearInterval(timer);
            }

            io.emit("time left", timeLeft);
            //console.log("Time elasped (secs):" + (timeElasped/1000));
            //console.log("Time left (secs):" + (timeLeft/1000));
          }, 1000);
        }
      }
    });

    //User has left
    //Remove the user from the list of users
    socket.on("disconnect", () => {
      //Remove User from userlist
      waitingForTarget = removeUser(
        addedUser,
        socket,
        io,
        userList,
        waitingForTarget
      );

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
        socket.broadcast.emit("chat message", {
          username: userList.users[socket.id].username,
          msg
        });

        socket.emit("self message", {
          username: userList.users[socket.id].username,
          msg
        });
      }
    });

    socket.on("typing", function() {
      if (userList.users[socket.id]) {
        let username = userList.users[socket.id].username;
        io.emit("typing", username);
      }
    });

    socket.on("stop typing", function() {
      if (userList.users[socket.id]) {
        let username = userList.users[socket.id].username;
        io.emit("stop typing", username);
      }
    });

    socket.on("password submit", function(password) {
      console.log("Checking if password is correct");
      console.log(password);

      let match = checkPassword(password, userList);
      
      let attempts = --userList.users[socket.id].attempts;
      if (match) {
        console.log("Right! Spies win!");
        socket.emit("password result", match, attempts);
      } else {
        console.log("Wrong Pass");
        socket.emit("password result", match, attempts);
      }

      if(userList.users[socket.id].attempts <= 0){
        console.log("GAME OVER: Spies loses");
      }
    });

    socket.on("accused submit", function(accused) {
      console.log("Checking if accused is correct");
      console.log(accused);

      let match = false;
      if (accused.length == SPY_AMOUNT) {
        //Get who is a spy and who is a liar
        let spies = findSpies(userList);
        let liar = findLiar(userList);

        match = true;
        accused.map(accuse => {
          if (!spies.includes(accuse)) {
            match = false;
          }
        });

        if (accused.includes(liar)) {
          console.log("Accused the liar!");

          for (user in userList.users) {
            let role = userList.users[user].role;
            if (role == "liar") {
              if(!userList.users[user].whoGuessedMe.includes(socket)){
                userList.users[user].attempts--;
                userList.users[user].whoGuessedMe.push(socket);
                
                //If all detectives have guess liars once
                if(userList.users[user].attempts <= 0){
                  console.log("LIAR WINS!");
                }
              }
            }
          }
        }
      }

      let attempts = --userList.users[socket.id].attempts;
      console.log(`Picked spies: ${match}`);
      socket.emit("accused result", match, attempts);
      
      if(userList.users[socket.id].attempts <= 0){
        console.log("GAME OVER: Detectives loses");
      }
    });

    socket.on("error", function(err) {
      console.log(err);
    });
  });
};
