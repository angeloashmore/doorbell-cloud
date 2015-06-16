const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "stripePlanId": null,
  "type": null
};

Parse.Cloud.beforeSave("Plan", function(request, response) {
  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });

  if (!["user", "organization"].includes(request.object.get("type"))) {
    throw new Error("Column `type` must be either \"user\" or \"organization\".")
  }
});
