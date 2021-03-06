var findSpies = require("../checks/find.js").findSpies;

//Sends the user list as well as the score
function sendUserList(io, userList) {
  let userScoreList = {};
  for (user in userList.users) {
    userScoreList[userList.users[user].username] = userList.users[user].score;
  }
  io.emit("update userScorelist", userScoreList);
}

function sendHalfOfPass(io, userList, password) {
  //Divide the password into two
  let pass1 = password.slice(0, Math.floor(password.length / 2));
  let pass2 = password.slice(Math.floor(password.length / 2), password.length);
  //Find the spies in userlist
  let spiesIDs = [];

  for (user in userList.users) {
    let role = userList.users[user].role;
    if (role == "spy") {
      spiesIDs.push(user);
    }
  }
  //Emit password to spies
  io.to(spiesIDs[0]).emit("starting password", pass1);
  io.to(spiesIDs[1]).emit("starting password", pass2);
}

function sendOtherSpies(io, userList) {
  //Find the spies in userlist
  let spiesIDs = [];

  for (user in userList.users) {
    let role = userList.users[user].role;
    if (role == "spy") {
      spiesIDs.push(user);
    }
  }

  //Emit other spy info
  io.to(spiesIDs[0]).emit("other spy", userList.users[spiesIDs[1]].username);
  io.to(spiesIDs[1]).emit("other spy", userList.users[spiesIDs[0]].username);
}

module.exports = {
  sendUserList,
  sendHalfOfPass,
  sendOtherSpies
};
