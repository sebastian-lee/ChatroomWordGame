//Imports for StartGame
var getRandomRoles = require("../util/random.js").getRandomRoles;
var getRandomPassword = require("../util/random.js").getRandomPassword;
var applyRoleAttempts = require("../users/init.js").applyRoleAttempts;
var sendHalfOfPass = require("../updates/update.js").sendHalfOfPass;
var sendOtherSpies = require("../updates/update.js").sendOtherSpies;

function gameTimer(io, GAME_LENGTH) {
  let startTime = Date.now();
  let endTime = startTime + GAME_LENGTH * 60 * 1000;
  let timer = setInterval(function() {
    let now = Date.now();
    let timeElasped = now - startTime;
    let timeLeft = endTime - now;
    if (now > endTime) {
      console.log("Time is up.");
      timeUp(io);
      clearInterval(timer);
    }
    io.emit("time left", timeLeft);
  }, 1000);
  return timer;
}

function stopTimer(timer) {
  clearInterval(timer);
}

//Game time has ended. Since no win conditions were met.
function timeUp(io) {
  gameOver(io, whoWon(false, false, false));
}

function whoWon(detectives, spies, liar) {
  detectives = detectives || false;
  spies = spies || false;
  liar = liar || false;

  return {
    detectives: detectives,
    spies: spies,
    liar: liar
  };
}

//Game over
function gameOver(io, winners, timer) {
  //Winners should be an object with win loss for each group of players
  io.emit("game over", winners);
  stopTimer(timer);
}

function stopGame(timer){
  stopTimer(timer);
}

//Start Game
function startGame(
  io,
  userList,
  DETECTIVE_ATTEMPT_AMOUNT,
  SPY_ATTEMPT_AMOUNT,
  LIAR_ATTEMPT_AMOUNT,
  GAME_LENGTH
) {
  
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
  userList.password = getRandomPassword();
  console.log(`Password is ${userList.password}`);
  //Send half of password to the two spies
  sendHalfOfPass(io, userList, userList.password);
  //Send who the other spy is
  sendOtherSpies(io, userList);

  //Start Timer
  let timer = gameTimer(io, GAME_LENGTH);
  io.emit("game start");
  io.emit("server message", `Starting game!`);
  return timer;
}

module.exports = {
  gameTimer,
  stopGame,
  whoWon,
  gameOver,
  startGame
};
