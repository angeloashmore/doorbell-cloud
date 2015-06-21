var methods = [
  "_afterDelete",
  "_afterSave",
  "_beforeSave",
  "create"
];

methods.forEach(function(method) {
  require("cloud/functions/Team/" + method);
});
