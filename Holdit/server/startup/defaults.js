Meteor.startup(function () {

  Accounts.onCreateUser(function(options, user) {
    // We're enforcing at least an empty profile object to avoid needing to check
    // for its existence later.
    user.profile = options.profile ? options.profile : {};
    user.profile.username = user.emails[0].address.split("@",1)[0];
    console.log(user);
    return user;
  });

  //Defaults values for users and topics on startup
  //for testing purposes
  if (Meteor.users.find().count() === 0) {
    var user_id = Accounts.createUser({
      email:"m.coenca@gmail.com",
      password:"cristohoger24"
    });
    var topicMore_id = Topics.insert({
      user_id:user_id,
      name:"TestMore",
      description:"TestMore Description",
      type: "private"
    });    
    var topicLess_id = Topics.insert({
      user_id:user_id,
      name:"TestLess",
      description:"TestLess Description",
      type:"private"
    });
    var topicMore = Topics.findOne(topicMore_id);
    var topicLess = Topics.findOne(topicLess_id);
    topicMore.addACount(user_id);
    topicMore.addACount(user_id);
    topicMore.addACount(user_id);
    topicLess.addACount(user_id);
    var timestamp = (new Date()).getTime();
    var goalMore_id = DailyGoals.insert({
      topic_id:topicMore_id,
      user_id:user_id,
      comparator:"moreThan",
      timestamp:timestamp,
      value:5
    });

    var goalLess_id = DailyGoals.insert({
      topic_id: topicLess_id,
      user_id:user_id,
      comparator:"lessThan",
      timestamp:timestamp,
      value:8
    });
  }
});