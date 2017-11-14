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

function stopTimer(timer){
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

module.exports = {
  gameTimer,
  whoWon,
  gameOver
};
