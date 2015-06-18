const Stripe = require('cloud/lib/stripe');
const organizationRoleName = require('cloud/lib/organizationRoleName');

Parse.Cloud.afterSave("Profile", function(request) {
  var profile = request.object;

  setACL(profile);
});

function setACL(profile) {
  if (profile.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const acl = new Parse.ACL(profile.get("user"));
    profile.setACL(acl);
    return profile.save();

  }, function(error) {
    console.error(error);
  });
}
