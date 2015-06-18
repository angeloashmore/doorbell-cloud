const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "user": null,
  "organization": null,
  "private": false
};

Parse.Cloud.beforeSave("Profile", function(request, response) {
  const profile = request.object;

  validateRequiredColumns(profile, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
