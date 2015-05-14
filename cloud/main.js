var parseClasses = [
  "User"
]

parseClasses.forEach(function(parseClass) {
  require("cloud/classes/" + parseClass + "/index");
});
