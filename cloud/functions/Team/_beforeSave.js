const Errors = require("cloud/errors/index");
const Team = require("cloud/classes/Team");

Parse.Cloud.beforeSave(Team, function(request, response) {
  const team = request.object;

  response.success();
});
