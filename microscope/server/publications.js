// Publish all posts
Meteor.publish('posts', function() {
  return Posts.find();
});

// Publish all comments
Meteor.publish('comments', function() {
  return Comments.find();
});
