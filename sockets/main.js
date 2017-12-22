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
var stopGame = require("./util/game.js").stopGame;
var startGame = require("./util/game.js").startGame;

//Word list options
var wordDatabase = require("./wordDatabase");

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

module.exports = class Chatroom{

  constructor(){
    //User List
    this.userList = {
      length: 0,
      order: [],
      password: [],
      users: {}
    };

    this.timer = undefined;
    this.gameInProgress = false;
    this.connection = this.connection.bind(this);
  };
  
  connection(socket,room,io){
    console.log(this);
    //New user connection
    //keep track if this user has been added
    let addedUser = false;
    /*
     * Add the new user to the list of users
     * with a unique name 
     */

    socket.in(room).on("add username", (username)=>{
      //Do not let more than the required amount join
      if (this.userList.length >= REQUIRED_PLAYERS) {
        console.log("Enough Players have joined.");
        return;
      }

      //Sanitize username
      username = String(username);
      console.log("new username " + username);
      if (
        addUser(addedUser, socket, room, username, this.userList)
      ) {
        addedUser = true;

        //Update client that login successful
        socket.emit("logged in", true);
        socket.emit("my username", username);

        //send updated userlist
        sendUserList(io, room, this.userList);

        console.log(`There are ${this.userList.length} players.`);
        if (this.userList.length < REQUIRED_PLAYERS) {
          console.log("Waiting for more players to join");
          io.to(room).emit(
            "server message",
            `Waiting for ${5 - this.userList.length} more players to join`
          );
        } else {
          //Start Game
          if (!this.gameInProgress) {
            console.log(`There are enough players.`);
            let options = wordDatabase.options;
            io.to(room).to(this.userList.order[0]).emit("game settings", options);
          }
        }
      }
    });

    socket.to(room).on("start game",(wordList)=>{
      //Start Game
      this.timer = startGame(
        io,
        room,
        this.userList,
        DETECTIVE_ATTEMPT_AMOUNT,
        SPY_ATTEMPT_AMOUNT,
        LIAR_ATTEMPT_AMOUNT,
        GAME_LENGTH,
        wordDatabase[wordList]
      );
      this.gameInProgress = true;
    });

    //User has left
    //Remove the user from the list of users
    socket.to(room).on("disconnect", () => {
      //Remove User from userlist
      removeUser(addedUser, socket, io, room, this.userList);

      //send updated userlist
      sendUserList(io, room, this.userList);

      //If game is in progress, end game
      if(this.gameInProgress){
        this.gameInProgress = false;
        stopGame(this.timer);
        console.log("Waiting to start new game");
        io.to(room).emit(
          "server message",
          `Waiting for ${5 - this.userList.length} more players to join`
        );
      }
    });

    socket.to(room).on("chat message", (msg)=>{
      //Sanitize msg
      msg = String(msg);

      //Check if this user was added
      if (addedUser) {
        //Emit message to chatroom
        socket.to(room).emit("chat message", {
          username: this.userList.users[socket.id].username,
          msg
        });

        socket.emit("self message", {
          username: this.userList.users[socket.id].username,
          msg
        });
      }
    });

    socket.to(room).on("typing", ()=>{
      if (this.userList.users[socket.id]) {
        let username = this.userList.users[socket.id].username;
        socket.to(room).emit("typing", username);
      }
    });

    socket.to(room).on("stop typing", ()=>{
      if (this.userList.users[socket.id]) {
        let username = this.userList.users[socket.id].username;
        socket.to(room).emit("stop typing", username);
      }
    });

    socket.to(room).on("password submit", (password)=>{
      //Check if password came from a spy
      if (this.userList.users[socket.id].role != "spy") return;

      console.log("Checking if password is correct");
      console.log(password);

      let match = checkPassword(password, this.userList);

      let attempts = --this.userList.users[socket.id].attempts;
      if (match) {
        console.log("Right! Spies win!");
        socket.emit("password result", match, attempts);
        gameOver(io, room, whoWon(false, true, false), this.timer);
        this.gameInProgress = false;
      } else {
        console.log("Wrong Pass");
        socket.emit("password result", match, attempts);
      }

      if (this.userList.users[socket.id].attempts <= 0) {
        console.log("GAME OVER: Spies loses");
        gameOver(io, room, whoWon(true, false, true), this.timer);
        this.gameInProgress = false;
      }
    });

    socket.to(room).on("accused submit", (accused)=>{
      //Check if input came from a detective
      if (this.userList.users[socket.id].role != "detective") return;

      console.log("Checking if accused is correct");
      console.log(accused);

      let match = false;
      if (accused.length == SPY_AMOUNT) {
        //Get who is a spy and who is a liar
        let spies = findSpies(this.userList);
        let liar = findLiar(this.userList);

        match = true;
        accused.map(accuse => {
          if (!spies.includes(accuse)) {
            match = false;
          }
        });

        if (accused.includes(liar)) {
          console.log("Accused the liar!");

          for (user in this.userList.users) {
            let role = this.userList.users[user].role;
            if (role == "liar") {
              //Check if this detective has already guessed the liar.
              if (!this.userList.users[user].whoGuessedMe.includes(socket)) {
                this.userList.users[user].attempts--;
                this.userList.users[user].whoGuessedMe.push(socket);

                //If all detectives have guess liars once
                if (this.userList.users[user].attempts <= 0) {
                  console.log("LIAR WINS!");
                  gameOver(io, room, whoWon(false, false, true), this.timer);
                  this.gameInProgress = false;
                }
              }
            }
          }
        }

        let attempts = --this.userList.users[socket.id].attempts;
        console.log(`Picked spies: ${match}`);
        if (match) {
          console.log("Detectives win!");
          gameOver(io, room, whoWon(true, false, false), this.timer);
          this.gameInProgress = false;
        } else {
          console.log("Did not pick spies");
          socket.emit("accused result", match, attempts);
        }
        if (this.userList.users[socket.id].attempts <= 0) {
          console.log("GAME OVER: Detectives loses");
          gameOver(io, room, whoWon(false, true, true), this.timer);
          this.gameInProgress = false;
        }
      }
    });

    socket.to(room).on("restart game", (restart)=>{
      if (restart == true && !this.gameInProgress) {
        if (this.userList.length < REQUIRED_PLAYERS) {
          console.log("Waiting for more players to join");
          io.to(room).emit(
            "server message",
            `Waiting for ${5 - this.userList.length} more players to join`
          );
        } else {
          //Start Game
          console.log(`There are enough players. Starting Game.`);
          this.timer = startGame(
            io,
            room,
            this.userList,
            DETECTIVE_ATTEMPT_AMOUNT,
            SPY_ATTEMPT_AMOUNT,
            LIAR_ATTEMPT_AMOUNT,
            GAME_LENGTH
          );
          this.gameInProgress = true;
        }
      }
    });

    socket.to(room).on("error", (err)=>{
      console.log(err);
    });
  }
};
