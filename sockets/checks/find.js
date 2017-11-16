function findSpies(userList){
    let spies = [];
    for (user in userList.users) {
      let role = userList.users[user].role;
      if (role == "spy") {
        spies.push(userList.users[user].username);
      }
    }
    return spies;
}
function findLiar(userList){
  for (user in userList.users) {
    let role = userList.users[user].role;
    if (role == "liar") {
      return userList.users[user].username;
    }
  }
}

function findDetectives(userList){
  let detectives = [];
  for (user in userList.users) {
    let role = userList.users[user].role;
    if (role == "detective") {
      detectives.push(userList.users[user].username);
    }
  }
  return detectives;
}

module.exports = {
  findSpies,
  findLiar,
  findDetectives
};
