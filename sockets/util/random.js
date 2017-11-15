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

function getRandomRoles(userList) {
  let roles = ["spy", "spy", "detective", "detective", "liar"];

  for (user in userList.users) {
    if (roles.length == 0) return;
    let randNum = getRandomInt(0, roles.length);
    userList.users[user].role = roles[randNum];
    roles = roles
      .slice(0, randNum)
      .concat(roles.slice(randNum + 1, roles.length));
  }
}

const PASS_LENGTH = 6;

function getRandomPassword() {
  //push random words into the password array
  let passwordArr = wordDatabase;
  let password = [];
  for (let i = 0; i < PASS_LENGTH; i++) {
    let randNum = getRandomInt(0, passwordArr.length);
    password.push(passwordArr[randNum]);
    passwordArr = passwordArr
      .slice(0, randNum)
      .concat(passwordArr.slice(randNum + 1, passwordArr.length));
  }
  return password;
}

module.exports = {
  getRandomInt,
  getRandomUser,
  getRandomRoles,
  getRandomPassword
};
