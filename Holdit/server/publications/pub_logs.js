// Publish all counts for requested topic_id.
Meteor.publish('logs', function (topic_id) {
  // check if this of the right format. if not throw error.
  // See docs.
  check(topic_id, String);
  return Logs.find({topic_id: topic_id});
});// Publish all counts for requested topic_id.
Meteor.publish('allLogs', function () {
  this.unblock();
  return Logs.find();
});