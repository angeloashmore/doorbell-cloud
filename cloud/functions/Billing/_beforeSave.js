const Billing = require("cloud/classes/Billing");

Parse.Cloud.beforeSave(Billing, function(request, response) {
  const billing = request.object;

  response.success();
});
