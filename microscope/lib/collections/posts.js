Posts = new Mongo.Collection('posts');

// For collection hooks, only one per the given set needs to return true
// for the hook to be granted or denied.

// Since insecure is removed, these are the explicit allow conditions
Posts.allow({
  // Verifies the user owns the posts before allowing a modification
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});

// The explicit deny list (overrides the allow list)
Posts.deny({
  update: function(userId, post, fieldNames){
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});


Meteor.methods({

  // Verify the attributes of the post are the correct type
  postInsert: function(postAttributes) {
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }

    // Get the user information and add it to the post
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    // Insert the post and get the ID
    var postId = Posts.insert(post);

    // Return the post ID
    return {
      _id: postId
    };
  }
});
