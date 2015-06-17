const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "email": null,
  "name": null,
  "professional": false
};

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  const user = request.object;
  validateRequiredColumns(user, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
