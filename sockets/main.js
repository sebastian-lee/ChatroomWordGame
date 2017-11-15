//Import from Updates
var sendUserList = require("./updates/update.js").sendUserList;

//Import from Checks
var checkPassword = require("./checks/check.js").checkPassword;
var findSpies = require("./checks/find.js").findSpies;
var findLiar = require("./checks/find.js").findLiar;

//Import from Users
var addUser = require("./users/addUser.js");
var removeUser = require("./users/removeUser.js");

//Import from game
var whoWon = require("./util/game.js").whoWon;
var gameOver = require("./util/game.js").gameOver;
var startGame = require("./util/game.js").startGame;

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

  var timer;
  var gameInProgress = false;

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

        //Update client that login successful
        socket.emit("logged in", true);
        socket.emit("my username", username);

        //send updated userlist
        sendUserList(io, userList);

        console.log(`There are ${userList.length} players.`);
        if (userList.length < REQUIRED_PLAYERS) {
          console.log("Waiting for more players to join");
          io.emit(
            "server message",
            `Waiting for ${5 - userList.length} more players to join`
          );
        } else {
          //Start Game
          if (!gameInProgress) {
            console.log(`There are enough players. Starting Game.`);

            //Start Game
            timer = startGame(
              io,
              userList,
              DETECTIVE_ATTEMPT_AMOUNT,
              SPY_ATTEMPT_AMOUNT,
              LIAR_ATTEMPT_AMOUNT,
              GAME_LENGTH
            );
            gameInProgress = true;
          }
        }
      }
    });

    //User has left
    //Remove the user from the list of users
    socket.on("disconnect", () => {
      //Remove User from userlist
      removeUser(addedUser, socket, io, userList);

      //send updated userlist
      sendUserList(io, userList);
    });

    socket.on("chat message", function(msg) {
      //Sanitize msg
      msg = String(msg);

      //Check if this user was added
      if (addedUser) {
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
      //Check if password came from a spy
      if (userList.users[socket.id].role != "spy") return;

      console.log("Checking if password is correct");
      console.log(password);

      let match = checkPassword(password, userList);

      let attempts = --userList.users[socket.id].attempts;
      if (match) {
        console.log("Right! Spies win!");
        socket.emit("password result", match, attempts);
        gameOver(io, whoWon(false, true, false), timer);
        gameInProgress = false;
      } else {
        console.log("Wrong Pass");
        socket.emit("password result", match, attempts);
      }

      if (userList.users[socket.id].attempts <= 0) {
        console.log("GAME OVER: Spies loses");
        gameOver(io, whoWon(true, false, true), timer);
        gameInProgress = false;
      }
    });

    socket.on("accused submit", function(accused) {
      //Check if input came from a detective
      if (userList.users[socket.id].role != "detective") return;

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
              //Check if this detective has already guessed the liar.
              if (!userList.users[user].whoGuessedMe.includes(socket)) {
                userList.users[user].attempts--;
                userList.users[user].whoGuessedMe.push(socket);

                //If all detectives have guess liars once
                if (userList.users[user].attempts <= 0) {
                  console.log("LIAR WINS!");
                  gameOver(io, whoWon(false, false, true), timer);
                  gameInProgress = false;
                }
              }
            }
          }
        }

        let attempts = --userList.users[socket.id].attempts;
        console.log(`Picked spies: ${match}`);
        if (match) {
          console.log("Detectives win!");
          gameOver(io, whoWon(true, false, false), timer);
          gameInProgress = false;
        } else {
          console.log("Did not pick spies");
          socket.emit("accused result", match, attempts);
        }
        if (userList.users[socket.id].attempts <= 0) {
          console.log("GAME OVER: Detectives loses");
          gameOver(io, whoWon(false, true, true), timer);
          gameInProgress = false;
        }
      }
    });

    socket.on("restart game", function(restart) {
      if (restart == true && !gameInProgress) {
        if (userList.length < REQUIRED_PLAYERS) {
          console.log("Waiting for more players to join");
          io.emit(
            "server message",
            `Waiting for ${5 - userList.length} more players to join`
          );
        } else {
          //Start Game
          console.log(`There are enough players. Starting Game.`);
          timer = startGame(
            io,
            userList,
            DETECTIVE_ATTEMPT_AMOUNT,
            SPY_ATTEMPT_AMOUNT,
            LIAR_ATTEMPT_AMOUNT,
            GAME_LENGTH
          );
          gameInProgress = true;
        }
      }
    });

    socket.on("error", function(err) {
      console.log(err);
    });
  });
};
