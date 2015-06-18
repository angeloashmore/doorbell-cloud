const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "stripePlanId": null,
  "type": null
};

Parse.Cloud.beforeSave("Plan", function(request, response) {
  const plan = request.object;

  validateRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });

  if (["user", "organization"].indexOf(plan.get("type")) < 0) {
    throw new Error("Column `type` must be either \"user\" or \"organization\".")
  }
});
