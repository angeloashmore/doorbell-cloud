const Organization = require("cloud/classes/Organization");

Parse.Cloud.beforeSave(Organization, function(request, response) {
  const organization = request.object;

  response.success();
});
