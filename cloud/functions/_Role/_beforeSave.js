const Role = require("cloud/classes/_Role");

Parse.Cloud.beforeSave(Role, function(request, response) {
  const role = request.object;

  response.success();
});
