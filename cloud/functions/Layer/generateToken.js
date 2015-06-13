const fs = require("fs");
const layer = require("cloud/lib/layer-parse-module/layer-module");
const config = require('cloud/config');
const privateKey = fs.readFileSync("cloud/lib/layer-parse-module/keys/layer-key.js");

layer.initialize(config.LAYER_PROVIDER_ID, config.LAYER_KEY_ID, privateKey);

Parse.Cloud.define("generateToken", function(request, response) {
  var userID = request.params.userID;
  var nonce = request.params.nonce;
  if (!userID) throw new Error("Missing userID parameter");
  if (!nonce) throw new Error("Missing nonce parameter");
  response.success(layer.layerIdentityToken(userID, nonce));
});
