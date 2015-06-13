var definitions = {
  "classes": [
    "_Role",
    "_User",
    "Billing",
    "Event",
    "EventInvitation",
    "Organization",
    "Plan",
    "Profile"
  ],
  "functions": [
    "Layer"
  ]
}

for (var type in definitions) {
  definitions[type].forEach(function(namespace) {
    require(["cloud", type, namespace, "index"].join("/"));
  });
}
