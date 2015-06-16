var methods = [
  "_afterSave",
  "_beforeSave"
];

methods.forEach(function(method) {
  require("cloud/classes/_User/" + method);
});
