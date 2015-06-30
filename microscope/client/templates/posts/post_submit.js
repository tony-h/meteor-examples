// Binding an event to the new post submit event
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // Call postInsert to validate the data. postInsert returns the post ID
    Meteor.call('postInsert', post, function(error, result) {

      // on error, display the error to the user and abort
      if (error) {
        return alert(error.reason);
      }

      // Post has been created and validated. Display the post.
      Router.go('postPage', {_id: result._id});

    });
  }
});
