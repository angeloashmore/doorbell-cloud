const errors = [
  "InvalidAttrValue",
  "OnlyNewObjects",
  "RequiredAttrMissing"
];

errors.forEach(function(error) {
  exports[error] = require(["cloud", "errors", error].join("/"));
});
