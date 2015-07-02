Template.errors.helpers({

  // Return all errors
  errors: function() {
    return Errors.find();
  }
});

Template.error.onRendered(function() {

  // Clear errors after a set time
  var error = this.data;
  Meteor.setTimeout(function () {
    Errors.remove(error._id);
  }, 3000);
});
