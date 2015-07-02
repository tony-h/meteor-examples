
Template.postSubmit.onCreated(function() {
  // Setup the submit errors info
  Session.set('postSubmitErrors', {});
});

Template.postSubmit.helpers({
  // Based on the HTML field, get the error message to display
  errorMessage: function(field) {
    return Session.get('postSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('postSubmitErrors')[field] ? 'has-error' : '';
  }
});

// Binding an event to the new post submit event
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // Validate the post values prior to sending them to the db
    var errors = validatePost(post);
    if (errors.title || errors.url) {
      return Session.set('postSubmitErrors', errors);
    }

    // Call postInsert to validate the data. postInsert returns the post ID
    Meteor.call('postInsert', post, function(error, result) {

      // on error, display the error to the user and abort
      if (error) {
        return throwError(error.reason);
      }

      // If post exsits, display message and to route to page
      if (result.postExists) {
        throwError('This link has already been posted');
      }

      // Post has been created and validated. Display the post.
      Router.go('postPage', {_id: result._id});

    });
  }
});
