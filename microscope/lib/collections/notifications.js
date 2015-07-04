// Hold the notifications of event to sent to the users
Notifications = new Mongo.Collection('notifications');

Notifications.allow({

  // Allow update if the user owns the doucment, contains valid data, and
  // not already be read
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) &&
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

// Create a notification about a specific comment and who made it
createCommentNotification = function(comment) {

  var post = Posts.findOne(comment.postId);

  if (comment.userId !== post.userId) {
    Notifications.insert({
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};
