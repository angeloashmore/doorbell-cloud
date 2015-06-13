const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "stripeId": null
};

Parse.Cloud.beforeSave("Plan", function(request, response) {
  verifyRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
