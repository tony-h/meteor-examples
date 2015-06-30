// Configure the router when to load what
Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

// Default route
Router.route('/', {name: 'postsList'});

// View the post based on the id
Router.route('/posts/:_id', {
  name: 'postPage',
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
