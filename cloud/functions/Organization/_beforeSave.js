const Errors = require("cloud/errors/index");
const Organization = require("cloud/classes/Organization");

Parse.Cloud.beforeSave(Organization, function(request, response) {
  const organization = request.object;

  if (!request.user) throw new Errors.UserNotLoggedIn();

  response.success();
});
