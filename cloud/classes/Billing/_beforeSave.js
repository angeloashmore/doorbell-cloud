const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "relationship": null,
  "plan": null,
  "brand": null,
  "last4": null,
  "expMonth": null,
  "expYear": null
};

Parse.Cloud.beforeSave("Billing", function(request, response) {
  verifyRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
