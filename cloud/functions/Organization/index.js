var methods = [
  "_afterSave",
  "_beforeSave"
];

methods.forEach(function(method) {
  require("cloud/functions/Organization/" + method);
});
