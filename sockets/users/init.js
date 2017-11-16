function applyRoleAttempts(
    userList,
    detectiveAttempts,
    spyAttempts,
    liarAttempts
  ) {
    for (let user in userList.users) {
      role = userList.users[user].role;
      switch (role) {
        case "detective":
          userList.users[user].attempts = detectiveAttempts;
          break;
        case "spy":
          userList.users[user].attempts = spyAttempts;
          break;
        case "liar":
          userList.users[user].attempts = liarAttempts;
          userList.users[user].whoGuessedMe = [];
          break;
        default:
          console.log(`${role} is not a role`);
      }
    }
  }

  module.exports = {
      applyRoleAttempts
  };