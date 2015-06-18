const Profile = require("cloud/classes/Profile");

Parse.Cloud.afterSave(Profile, function(request) {
  var profile = request.object;

  if (!profile.existed()) {
    profile.configureDefaultACL();
  }
});
