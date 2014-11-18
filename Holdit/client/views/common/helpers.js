//This is where we define helpers usable everywhere
Template.registerHelper('debug', function() {
  console.log(this);
});

Template.registerHelper('currentUserIsAdmin', function() {
  if (Meteor.user()) {
    return Meteor.user().isAdmin();      
  }
  else {
    return false;
  }
});


Template.registerHelper('isMine', function() {
  return (this.user_id === Meteor.userId()) ;
});