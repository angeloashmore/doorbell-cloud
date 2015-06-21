const Errors = require("cloud/errors/index");
const Enums = require("cloud/enums/Enums");
const Team = require("cloud/classes/Team");

Parse.Cloud.define("Team__create", function(request, response) {
  const user = request.user;

  Parse.Promise.as().then(function() {
    if (!user) throw new Errors.UserNotLoggedIn();

  }).then(function() {
    const team = new Team();
    team.set({
      name: request.params.name,
      email: request.params.email
    });
    return team.save(null, { useMasterKey: true });

  }).then(function(team) {
    return team.configureDefaultACL();

  }).then(function(team) {
    return team.createRoles({ useMasterKey: true })

  }).then(function(team) {
    return team.createBilling({ useMasterKey: true });

  }).then(function(team) {
    return team.addUser(user, Enums.RoleTypes.Owner, { useMasterKey: true });

  }).then(function(team) {
    response.success(team);

  }, function(error) {
    response.error(error);
  });
});
