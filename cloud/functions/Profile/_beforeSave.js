const Profile = require("cloud/classes/Profile");

Parse.Cloud.beforeSave(Profile, function(request, response) {
  const profile = request.object;

  response.success();
});
