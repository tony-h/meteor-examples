Template.postEdit.onCreated(function() {
  // Setup the edit errors info
  Session.set('postEditErrors', {});
});

Template.postEdit.helpers({
  // Based on the HTML form field, get the error message to display
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  }
});

// Handles the edit post events
Template.postEdit.events({
  'submit form': function(e) {

    // Stop the default JS event so Meteor can handle it
    e.preventDefault();

    var currentPostId = this._id;

    // Get the values from the form
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // Validate the data from the HTML forms on submit
    var errors = validatePost(postProperties);
    if (errors.title || errors.url) {
      return Session.set('postEditErrors', errors);
    }

    // Attempt an update if the credentials in in order
    Posts.update(currentPostId, {$set: postProperties}, function(error) {

      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  }

});
