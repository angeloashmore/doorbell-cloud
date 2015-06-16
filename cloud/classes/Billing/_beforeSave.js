const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "email": null,
  "relation": null
  // "stripeCustomerId": null
};

Parse.Cloud.beforeSave("Billing", function(request, response) {
  var billing = request.object;

  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
