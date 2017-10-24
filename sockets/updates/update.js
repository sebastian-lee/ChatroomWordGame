//Send the client the target user
function sendTargetUser(targetSocket, io, userList) {
  io
    .to(targetSocket)
    .emit(
      "new target user",
      userList.users[userList.users[targetSocket].targetUserID]
        ? userList.users[userList.users[targetSocket].targetUserID].username
        : ""
    );
}

//Send the client the target word
function sendTargetWord(targetSocket, io, userList) {
  io
    .to(targetSocket)
    .emit("new target word", userList.users[targetSocket].targetWord);
}

//Sends the user list as well as the score
function sendUserList(io, userList) {
  let userScoreList = {};
  for (user in userList.users) {
    userScoreList[userList.users[user].username] = userList.users[user].score;
  }
  io.emit("update userScorelist", userScoreList);
}

//sends the new score of a specific username 
function sendScore(io, username, score) {
  io.emit("update score", username, score);
}

module.exports = {
  sendTargetUser,
  sendTargetWord,
  sendUserList,
  sendScore
};
