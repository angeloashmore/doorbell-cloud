const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "organization": null
};

Parse.Cloud.beforeSave("Role", function(request, response) {
  const role = request.object;

  validateRequiredColumns(role, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
