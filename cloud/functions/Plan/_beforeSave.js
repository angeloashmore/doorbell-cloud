const Plan = require("cloud/classes/Plan");

Parse.Cloud.beforeSave(Plan, function(request, response) {
  const plan = request.object;

  response.success();
});
