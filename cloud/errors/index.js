const errors = [
  "InvalidAttrValues",
  "OnlyNewObjects",
  "UserNotLoggedIn",
  "RequiredAttrsMissing"
];

errors.forEach(function(error) {
  exports[error] = require(["cloud", "errors", error].join("/"));
});
