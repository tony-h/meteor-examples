if (Session.get('pageTitle') === undefined) {
    var title = 'Microscope #' + Math.floor((Math.random()) * 1000000);
    Session.set('pageTitle', title);
}

Template.layout.helpers({
  pageTitle: function() { return Session.get('pageTitle'); }
});
