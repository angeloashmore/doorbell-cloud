const Event = require("cloud/classes/Event");

Parse.Cloud.beforeSave(Event, function(request, response) {
  const event = request.object;

  response.success();
});
