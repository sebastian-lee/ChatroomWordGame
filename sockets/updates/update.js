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

function sendUsernameList(io, userList) {
  let usernameArray = [];
  for (user in userList.users) {
    usernameArray.push(userList.users[user].username);
  }
  io.emit("update userlist", usernameArray);
}

module.exports = {
    sendTargetUser,
    sendTargetWord,
    sendUsernameList
};
