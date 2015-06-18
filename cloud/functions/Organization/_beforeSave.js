const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "name": null,
  "email": null
};

Parse.Cloud.beforeSave("Organization", function(request, response) {
  const organization = request.object;

  validateRequiredColumns(organization, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
