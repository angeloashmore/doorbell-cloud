Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("email")) {
    return response.error("email is required");
  }

  if (!request.object.get("name")) {
    return response.error("name is required");
  }

  response.success();
});

// const Parse = require('cloud/ext_modules').Stripe;
//
// Parse.Cloud.beforeSave(Parse.User, function(request, response) {
//   // if (!request.object.get("email")) {
//   //   return response.error("email is required");
//   // }
//   //
//   // if (!request.object.get("name")) {
//   //   return response.error("name is required");
//   // }
//   //
//   // if (!request.object.existed()) {
//   //   var user = request.object;
//   //
//   //   Parse.Promise.as().then(function() {
//   //     return Stripe.Customers.create({
//   //       email: user.get("email"),
//   //       metadata: {
//   //         parseUserId: user.id
//   //       }
//   //     }).fail(function(error) {
//   //       console.log("Creating the customer with Stripe failed. Error: " + error);
//   //       return Parse.Promise.error('An error has occured.');
//   //     });
//   //
//   //   }).then(function(stripeCustomer) {
//   //     var billing = new Parse.Object("Billing");
//   //     billing.set("stripeCustomerId", stripeCustomer.id)
//   //
//   //     user.set("billing", billing);
//   //
//   //   }, function(error) {
//   //     console.error(error);
//   //   });
//   // }
//   //
//   // response.success();
//
//   var user = request.object;
//
//   Parse.Promise.as().then(function() {
//     if (!user.get("email")) {
//       return Parse.Promise.error("email is required");
//     }
//
//     if (!user.get("name")) {
//       return Parse.Promise.error("name is required");
//     }
//
//   }).then(function() {
//     if (!user.existed()) {
//
//       return Parse.Promise.as().then(function() {
//         return Stripe.Customers.create({
//           email: user.get("email"),
//           metadata: {
//             parseUserId: user.id
//           }
//         }).fail(function(error) {
//           console.log("Creating the customer with Stripe failed. Error: " + error);
//           return Parse.Promise.error('An error has occured.');
//         });
//
//       }).then(function(stripeCustomer) {
//         var billing = new Parse.Object("Billing");
//         billing.set("stripeCustomerId", stripeCustomer.id)
//
//         user.set("billing", billing);
//
//       });
//     }
//
//   }).then(function() {
//     response.success();
//
//   }, function(error) {
//     console.error(error);
//   });
// });
