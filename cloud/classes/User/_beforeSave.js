Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("email")) {
    return response.error("email is required");
  }

  if (!request.object.get("firstName")) {
    return response.error("firstName is required");
  }

  if (!request.object.get("lastName")) {
    return response.error("lastName is required");
  }

  response.success();
});
