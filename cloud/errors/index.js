const errors = [
  "OnlyForNewObjects"
];

errors.forEach(function(error) {
  exports[error] = require(["cloud", "errors", error].join("/"));
});
