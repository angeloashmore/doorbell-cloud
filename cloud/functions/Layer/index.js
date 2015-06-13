var methods = [
  "generateToken",
];

methods.forEach(function(method) {
  require("cloud/functions/Layer/" + method);
});
