var wordDatabase = require("../wordDatabase");

//Returns a random int between a min and max
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//Returns a random socketID from the list of connected sockets
function getRandomUser(userList) {
  let clients = [];
  for (user in userList.users) {
    clients.push(user);
  }
  return clients[getRandomInt(0, clients.length)];
}

//Returns a random user socketID that is not self
function getRandomTargetUser(self, userList, waitingForTarget) {
  //If there are no other users put on waiting

  if (userList.length <= 1) {
    waitingForTarget.push(self);
    return null;
  }

  var targetUser = getRandomUser(userList);

  //Keep calling getRandomTargetUser until you get another user
  if (targetUser == self) {
    return getRandomTargetUser(self, userList, waitingForTarget);
  }

  return targetUser;
}

//Get a random Target word from the wordDatabase that isn't the last word
function getRandomTargetWord(lastWord = null) {
  let newWord = wordDatabase[getRandomInt(0, wordDatabase.length)];

  if (newWord == lastWord) {
    return getRandomTargetWord(lastWord);
  }

  return newWord;
}

module.exports = {
  getRandomInt,
  getRandomUser,
  getRandomTargetUser,
  getRandomTargetWord
};
