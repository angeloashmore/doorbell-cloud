var methods = [
  "_beforeSave",
];

methods.forEach(function(method) {
  require("cloud/classes/Plan/" + method);
});
