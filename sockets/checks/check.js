var sendTargetUser = require("../updates/update.js").sendTargetUser;
var sendTargetWord = require("../updates/update.js").sendTargetWord;
var sendScore = require("../updates/update.js").sendScore;

var getRandomTargetUser = require("../util/random.js").getRandomTargetUser;
var getRandomTargetWord = require("../util/random.js").getRandomTargetWord;

function checkUniqueUsername(socket, username, userList) {
  for (user in userList.users) {
    const userObj = userList.users[user];
    if (userObj.username == username) {
      return false;
    }
  }
  return true;
}

function checkWaitingList(userList, waitingForTarget, io) {
  //Check if anyone is on the waiting list and give them a target
  if (userList.length > 1 && waitingForTarget.length > 0) {
    waitingForTarget.filter(user => {
      //Since there is more than one user
      //target user now can be sent
      userList.users[user].targetUserID = getRandomTargetUser(
        user,
        userList,
        waitingForTarget
      );
      if (userList.users[user].targetUserID != null) {
        sendTargetUser(user, io, userList);
      }
    });
    waitingForTarget = [];
  }
}

function checkForTargetWord(msg, socket, userList, waitingForTarget, io) {
  for (user in userList.users) {
    const userID = user;
    const userObj = userList.users[userID];
    if (userObj.targetUserID == socket.id) {
      //A targeted user is talking
      //Check to see if they say the targeted word
      msg = msg.toLowerCase();
      if (msg.includes(userObj.targetWord.toLowerCase())) {
        //They said targeted word.
        console.log(
          `${userList.users[socket.id]
            .username} said ${userObj.username}'s word: ${userObj.targetWord}! GG`
        );

        //Update user with a new target user and word
        //note* something changes user to a different ID here
        //using const for now to stop the change
        userObj.targetUserID = getRandomTargetUser(
          user,
          userList,
          waitingForTarget
        );
        userObj.targetWord = getRandomTargetWord(userObj.targetWord);

        //Increment score and send
        userObj.score += 1;
        //sendUserList(io, userList);
        sendScore(io, userObj.username, userObj.score);

        //Update user with new targets
        sendTargetWord(userID, io, userList);
        sendTargetUser(userID, io, userList);
      }
    }
  }
}

function checkPassword(password, userList) {
  let match = false;
  //Checking password
  if (password.length == userList.password.length) {
    match = true;
    password.map(val => {
      if (!userList.password.includes(val)) {
        match = false;
      }
    });
  }
  return match;
}

module.exports = {
  checkUniqueUsername,
  checkWaitingList,
  checkForTargetWord,
  checkPassword
};
