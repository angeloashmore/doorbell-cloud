const User = require("cloud/classes/_User");

Parse.Cloud.beforeSave(User, function(request, response) {
  const user = request.object;

  user.set("username", request.params.email);

  response.success();
});
