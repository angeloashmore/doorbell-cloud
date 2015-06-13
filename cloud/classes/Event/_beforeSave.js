const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "user": null,
  "location": null,
  "description": null
};

Parse.Cloud.beforeSave("Event", function(request, response) {
  verifyRequiredColumns(request.object, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});
