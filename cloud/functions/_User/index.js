var methods = [
  "_afterSave",
  "_beforeSave"
];

methods.forEach(function(method) {
  require("cloud/functions/_User/" + method);
});
