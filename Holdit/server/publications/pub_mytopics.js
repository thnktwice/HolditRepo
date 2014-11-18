// Publish complete set of myTopics to all clients.
Meteor.publish('my_topics', function () {
  return MyTopics.find();
});