Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("email")) {
    return response.error("email is required for signup");
  }

  if (!request.object.get("name")) {
    return response.error("name is required for signup");
  }

  response.success();
});
