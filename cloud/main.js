var definitions = [
  "_Role",
  "_User",
  "Billing",
  "Event",
  "EventInvitation",
  "Layer",
  "Organization",
  "Plan",
  "Profile"
]

definitions.forEach(function(namespace) {
  require(["cloud", "functions", namespace, "index"].join("/"));
});
