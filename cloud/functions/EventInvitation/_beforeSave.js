const EventInvitation = require("cloud/classes/EventInvitation");

Parse.Cloud.beforeSave(EventInvitation, function(request, response) {
  const eventInvitation = request.object;

  response.success();
});
