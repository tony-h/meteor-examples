Posts = new Mongo.Collection('posts');

Posts.allow({
  insert: function(userId, doc) {
    // only allow posting if a user is logged in
    return !! userId;
  }
});


Meteor.methods({

  // Verify the attributes of the post are the correct type
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // Get the user information and add it to the post
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Data()
    });

    // Insert the post and get the ID
    var postId = Posts.insert(post);

    // Return the post ID
    return {
      _id: postId
    };
  }
});
