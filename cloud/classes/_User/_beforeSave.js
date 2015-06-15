const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "email": null,
  "name": null,
  "professional": false
};

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
