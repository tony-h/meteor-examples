
Template.postItem.helpers({

  // Sets the userId in the post metadata to link it to a user
  ownPost: function() {
    return this.userId === Meteor.userId();
  },

  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
});
