function checkUniqueUsername(socket, username, userList) {
  for (user in userList.users) {
    const userObj = userList.users[user];
    if (userObj.username == username) {
      return false;
    }
  }
  return true;
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
  checkPassword
};
