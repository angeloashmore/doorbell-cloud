Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  var user = request.object;

  if (!user.get("email")) {
    return response.error("email is required");
  }

  if (!user.get("firstName")) {
    return response.error("firstName is required");
  }

  if (!user.get("lastName")) {
    return response.error("lastName is required");
  }

  // Set fullName
  var fullName = user.get("firstName") + " " + user.get("lastName");
  user.set("fullName", fullName)

  // Set default private
  if (!user.get("private")) {
    user.set("private", false)
  }

  response.success();
});
