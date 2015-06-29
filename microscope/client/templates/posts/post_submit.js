// Binding an event to the new post submit event
Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    // Append the post ID as returned from Post.insert
    post._id = Posts.insert(post);

    // Show this post after creating it
    Router.go('postPage', post);
  }
});
