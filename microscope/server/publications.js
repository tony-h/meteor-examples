// Publish all posts
Meteor.publish('posts', function() {
  return Posts.find();
});

// Publish all comments
Meteor.publish('comments', function(postId) {
  check(postId, String);
  return Comments.find({postId: postId});
});

// Publish the Notifications
Meteor.publish('notifications', function() {
  return Notifications.find();
});
