var methods = [
  "_afterSave",
  "_beforeSave",
  "addCard",
  "subscribeToPlan"
];

methods.forEach(function(method) {
  require("cloud/classes/Billing/" + method);
});
