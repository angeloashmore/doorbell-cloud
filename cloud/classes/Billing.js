const Stripe = require("cloud/lib/stripe");
const Plan = require("cloud/classes/Plan");
const Enums = require("cloud/enums/Enums");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Billing = Parse.Object.extend("Billing", {
  // Instance methods
  requiredAttrs: [
    "email"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  configureDefaultACL: function() {
    const user = this.get("user");
    const team = this.get("team");
    const acl = new Parse.ACL();

    if (!!user) {
      acl.setReadAccess(user, true);
      acl.setWriteAccess(user, true);
    } else if (!!team) {
      acl.setRoleReadAccess(team.roleNameForType(Enums.RoleTypes.Billing), true);
      acl.setRoleWriteAccess(team.roleNameForType(Enums.RoleTypes.Billing), true);
    }

    this.setACL(acl);
    return this.save(null, { useMasterKey: true });
  },

  type: function() {
    if (!!this.get("user")) {
      return Enums.BillingTypes.User;
    } else if (!!this.get("team")) {
      return Enums.BillingTypes.Team;
    }

    throw new Error("Could not determine type");
  },

  createStripeCustomer: function() {
    const data = {
      email: this.get("email"),
      metadata: { parseBillingId: this.id }
    };

    const this_ = this;
    return Stripe.Customers.create(data)
      .then(function(stripeCustomer) {
        this_.set("stripeCustomerId", stripeCustomer.id);
        return this_.save(null, { useMasterKey: true });
      });
  },

  subscribeToPlan: function(plan) {
    const stripeCustomerId = this.get("stripeCustomerId");
    const data = { plan: plan.get("stripePlanId") };

    const this_ = this;
    return Stripe.Customers.updateSubscription(stripeCustomerId, data)
      .then(function() {
        this_.set("plan", plan);
        return this_.save(null, { useMasterKey: true });
      });
  }

}, {
  // Class methods
});

module.exports = Billing;
