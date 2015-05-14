Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("email")) {
    return response.error("email is required");
  }

  if (!request.object.get("name")) {
    return response.error("name is required");
  }

  response.success();
});
