var methods = [
  "_afterSave",
  "_beforeSave",
  "addCard",
  "subscribeToPlan"
];

methods.forEach(function(method) {
  require("cloud/functions/Billing/" + method);
});
