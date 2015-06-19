function UserNotLoggedIn(message) {
  this.name = "UserNotLoggedIn";
  this.message = message || "User is not logged in within a function requiring a logged in user";
  // this.stack = (new Error()).stack;
}
UserNotLoggedIn.prototype = Object.create(Error.prototype);
UserNotLoggedIn.prototype.constructor = UserNotLoggedIn;

module.exports = UserNotLoggedIn;
