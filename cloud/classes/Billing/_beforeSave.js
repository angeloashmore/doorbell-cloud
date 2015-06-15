const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "relation": null,
  "stripeCustomerId": null
};

Parse.Cloud.beforeSave("Billing", function(request, response) {
  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
