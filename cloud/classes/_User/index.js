var methods = [
  "_afterSave",
  "_beforeSave",
  "addCardToken",
  "subscribeTo"
];

methods.forEach(function(method) {
  require("cloud/classes/_User/" + method);
});
