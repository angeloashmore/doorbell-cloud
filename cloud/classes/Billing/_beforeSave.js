const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "email": null
};

Parse.Cloud.beforeSave("Billing", function(request, response) {
  const billing = request.object;

  validateRequiredColumns(billing, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
