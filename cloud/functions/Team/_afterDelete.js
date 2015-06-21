const Enums = require("cloud/enums/Enums");
const Team = require("cloud/classes/Team");

Parse.Cloud.afterDelete(Team, function(request) {
  const team = request.object;
  var roles, profiles, billing;

  team.findAllRoles()
    .then(function(roles_) {
      roles = roles_;
      return team.findBilling();
    }).then(function(billing) {
      billing = billing_;
      return team.findAllProfiles();
    }).then(function(profiles_) {
      profiles = profiles_;

      Parse.Object.destroyAll(roles);
      Parse.Object.destroyAll(profiles);
      billing.destory();

    }, function(error) {
      console.error(error);
    });
});
