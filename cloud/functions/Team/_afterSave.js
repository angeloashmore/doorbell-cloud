const Enums = require("cloud/enums/Enums");
const Team = require("cloud/classes/Team");

Parse.Cloud.afterSave(Team, function(request) {
  const team = request.object;

  if (!team.existed()) {
    team.createRoles()
      .then(function() {
        team.configureDefaultACL();
        team.createBilling();
      }, function(error) {
        console.error(error);
      });
  }
});
