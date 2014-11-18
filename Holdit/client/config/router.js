Router.configure({
  //Iron router configuration such as
  layoutTemplate: 'layout',
  onBeforeAction: function () {
    if (! Meteor.userId()) {
      this.render('login');
    } else {
      this.next();
    }
  }
});