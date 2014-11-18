//Topics - {user_id: string
//          name:string,
//          type:private or public
//          description:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
Topic = Model(Topics);

Topic.extend({
  defaultValues: {
    score: 0
  },
  uname_topic: function() {
    var user = Meteor.users.findOne({_id: this.user_id});
    if(user){
      return user.uname_user();
    }
  },
  appleUserDeviceTokens: function () {
    var user_device_tokens = [];
    var logs = Logs.find({topic_id: this._id});
    logs.forEach(function(log){
      var user = Users.findOne(log.user_id);
      if (user.profile){
        if (typeof user.profile.device_token !== 'undefined' && typeof user.profile.device_type !== 'undefined'){
          if (user.profile.device_type === 'iOS' ){
            user_device_tokens = _.union(user_device_tokens,[user.profile.device_token]);
          }
        }
      }  
    });

    return user_device_tokens;
  },
  androidUserDeviceTokens: function () {
    var user_device_tokens = [];
    var logs = Logs.find({topic_id: this._id});
    logs.forEach(function(log){
      var user = Users.findOne(log.user_id);
      if (user.profile){
        if (typeof user.profile.device_token !== 'undefined' && typeof user.profile.device_type !== 'undefined'){
          if (user.profile.device_type === 'android' ){
            user_device_tokens = _.union(user_device_tokens,[user.profile.device_token]);
          }
        }
      }  
    });

    return user_device_tokens;    
  },
  addACount: function (user_id){
    if(typeof Meteor.users.findOne(user_id) !== "undefined"){
      var my_score = Logs.find({user_id: user_id, topic_id: this._id, type: 'count'}).count() +1;
      //On click on plus, we insert a new log in the db
      var timestamp = (new Date()).getTime();
      Logs.insert({
        topic_id: this._id,
        user_id: user_id,
        type: 'count',
        timestamp: timestamp,
        score: my_score
      });

      //We update the score count
      var score = Logs.find({topic_id: this._id, type: 'count'}).count();
      Topics.update(this._id, {$set: {score: score}}); 
      return true;
    } else {
      throw new Meteor.Error(404,"user_id not found");
    }
  },
  resetScore: function () {
    var score = Logs.find({topic_id: this._id, type: 'count'}).count();
    Topics.update(this._id, {$set: {score: score}});       
  },
  dailyLogs : function () {
    // This is an array grouped by day with the relevant score
    var res = [];
    var user_id = Meteor.userId();

    var logs = Logs.find(
      {topic_id: this._id},
      {sort: {timestamp: -1}}
    ).fetch();

    res = _.chain(logs)
      .groupBy(function(log){
        var day = new Date(log.timestamp);
        var dayWrapper = moment(day);
        return dayWrapper.format('YYYY-MM-DD');
      })
      .map(function(dayLogs, key){
        var count = _.countBy(dayLogs,function(log){
          if (log.type === 'count' && log.user_id === user_id){return 'count';}
        }).count;
        return [dayLogs,count];
      })
      .value();
    // console.log(JSON.stringify(res));
    return res;
  },
  dailyGoal : function (user_id) {//return undefined if there is no goal set
    var daily_goal = DailyGoals.findOne({topic_id:this._id,user_id:user_id});
    if (typeof daily_goal !== 'undefined'){
      if (typeof daily_goal.value === 'undefined') {
        daily_goal = undefined;
      }
    }
    return daily_goal;
  }
});