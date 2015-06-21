const Enums = require("cloud/enums/Enums");
const Team = require("cloud/classes/Team");

Parse.Cloud.afterDelete(Team, function(request) {
  const team = request.object;

  team.destroyAllChildren({ useMasterKey: true });
});
