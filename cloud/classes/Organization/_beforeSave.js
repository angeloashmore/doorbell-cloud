const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "name": null,
  "users": null
};

Parse.Cloud.beforeSave("Organization", function(request, response) {
  verifyRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
