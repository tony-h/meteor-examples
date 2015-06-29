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

// 404 not found template.
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
