const User = require("cloud/classes/_User");

Parse.Cloud.beforeSave(User, function(request, response) {
  const user = request.object;

  user.username = user.email;

  response.success();
});
