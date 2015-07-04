// Configure the router when to load what
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return[Meteor.subscribe('notifications')];
  }
});

// Iron Router controller to hand the postsList (default) route
PostsListController = RouteController.extend({
  template: 'postsList',
  increment: 5,
  postsLimit: function() {
    return parseInt(this.params.postsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.postsLimit()};
  },
  subscriptions: function() {
    this.postsSub = Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.postsLimit();
    var nextPath = this.route.path({postsLimit: this.postsLimit() + this.increment});
    return {
      posts: this.posts(),
      ready: this.postsSub.ready,
      nextPath: hasMore ? nextPath : null
    };
  }
});


// Default route. Shows posts with pagination
Router.route('/:postsLimit?', {
  name: 'postsList'
});

// View the post based on the id
Router.route('/posts/:_id', {
  name: 'postPage',
  // Load the comments for this post id
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  // Load the posts for the post id
  data: function() {
    return Posts.findOne(this.params._id);
  }
});

// edit post route
Router.route('/posts/:_id/edit',{
  name: 'postEdit',
  data: function() { return Posts.findOne(this.params._id); }
});

// Page for submitting a new post
Router.route('/submit', {name: 'postSubmit'});

// If user is not logged in, show access denied form
var requireLogin = function() {
  if (! Meteor.user()) {

    // If actively logging in, show loading Template
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }

  } else {
    this.next();
  }
};

// Checks prior processing the page request
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
