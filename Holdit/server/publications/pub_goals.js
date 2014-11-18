// Publish complete set of goals to all clients.
// //THIS MAKES THE APP LAGGY I DONT KNOW WHY
Meteor.publish('goals', function () {
  this.unblock();
  return DailyGoals.find();
});