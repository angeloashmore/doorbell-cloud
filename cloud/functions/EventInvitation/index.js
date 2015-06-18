var methods = [
  "_beforeSave",
];

methods.forEach(function(method) {
  require("cloud/functions/EventInvitation/" + method);
});
