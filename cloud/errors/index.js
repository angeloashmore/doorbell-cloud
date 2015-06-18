const errors = [
  "InvalidAttrValues",
  "OnlyNewObjects",
  "RequiredAttrsMissing"
];

errors.forEach(function(error) {
  exports[error] = require(["cloud", "errors", error].join("/"));
});
