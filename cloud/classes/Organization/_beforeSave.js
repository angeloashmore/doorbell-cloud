const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "name": null,
  "email": null,
  "users": null
};

Parse.Cloud.beforeSave("Organization", function(request, response) {
  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
