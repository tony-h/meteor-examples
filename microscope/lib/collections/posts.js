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

Posts.deny({
  update: function(userId, post, fieldNames, modifier) {

    // Validate content in the fields on update
    var errors = validatePost(modifier.$set);
    return errors.title || errors.url;
  }
});

// Function to validate a post
validatePost = function (post) {

  // error messages for creating / editing a post
  var errors = {};

  if (!post.title) {
    errors.title = "Please fill in a headline";
  }
  if (!post.url) {
    errors.url = "Please fill in a URL";
  }

  return errors;
};

Meteor.methods({

  // A Meteor method  to insert a new post
  postInsert: function(postAttributes) {

    // Verify the attributes of the post are the correct type
    check(this.userId, String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // Server side validation invalid post data
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', "You must set a title and URL for your post");
    }

    // Determines if a post with the same link exists
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
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    // Insert the post and get the ID
    var postId = Posts.insert(post);

    // Return the post ID
    return {
      _id: postId
    };
  },

  // A Meteor method to increnemnt the up-vote
  upvote: function(postId) {

    // Verify the user and post ID
    check(this.userId, String);
    check(postId, String);

    var post = Posts.findOne(postId);

    if (!post) {
      throw new Meteor.Error('invalid', 'Post not found');
    }
    if (_.include(post.upvoters, this.userId)) {
      throw new Meteor.Error('invalid', 'Already upvoted this post');
    }

    // Updte the up-vote count
    Posts.update(post._id, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });
  }
});
