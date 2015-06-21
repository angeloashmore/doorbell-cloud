var definitions = [
  "_Role",
  "_User",
  "Billing",
  "Event",
  "EventInvitation",
  "Layer",
  "Plan",
  "Profile",
  "Team"
]

definitions.forEach(function(namespace) {
  require(["cloud", "functions", namespace, "index"].join("/"));
});
