var fs = require("fs");
var layer = require("cloud/layer-parse-module/layer-module");

var layerProviderID = "c85e93d6-d1de-11e4-8b48-e08ce8001374";
var layerKeyID = "ad387876-ff54-11e4-9401-8b63d7001a47";
var privateKey = fs.readFileSync("cloud/layer-parse-module/keys/layer-key.js");
layer.initialize(layerProviderID, layerKeyID, privateKey);

Parse.Cloud.define("generateToken", function(request, response) {
  var userID = request.params.userID;
  var nonce = request.params.nonce;
  if (!userID) throw new Error("Missing userID parameter");
  if (!nonce) throw new Error("Missing nonce parameter");
  response.success(layer.layerIdentityToken(userID, nonce));
});

var parseClasses = [
  "User"
]

parseClasses.forEach(function(parseClass) {
  require("cloud/classes/" + parseClass + "/index");
});
