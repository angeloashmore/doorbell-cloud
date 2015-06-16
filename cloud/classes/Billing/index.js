var methods = [
  "_beforeSave",
  "addCard",
  "subscribeTo"
];

methods.forEach(function(method) {
  require("cloud/classes/Billing/" + method);
});
