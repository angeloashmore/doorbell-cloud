var methods = [
  "_beforeSave",
  "addCardToken",
  "create",
  "subscribeTo"
];

methods.forEach(function(method) {
  require("cloud/classes/User/" + method);
});
