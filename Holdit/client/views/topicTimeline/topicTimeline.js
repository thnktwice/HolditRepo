Template.topicTimeline.events({
  'click #back' : function(){
    Router.go("topicsBoard");
  },
  'click #go_stats' : function (){
    Router.go("/topics/"+this.topic_id+"/stats");
  },
  'submit form.form-search' : function(e, templ) {
    //We stop the event from propagating
    e.preventDefault();
    //We take the value from the input
    var message = templ.$("#message_content");
    //We create the relevant new topic in the database
    //On click on plus, we insert a new log in the db
    var timestamp = (new Date()).getTime();

    var my_score = Logs.find({user_id: Meteor.userId(), topic_id: this.topic_id, type: 'count'}).count();

    var res = {
      topic_id: this.topic_id,
      user_id: Meteor.userId(),
      type: 'message',
      timestamp: timestamp,
      content: message.val(),
      score: my_score
    };
    if (Meteor.user().isAdmin() && res.content.charAt(0) === '&') {
      res.type = 'adminMessage';
      res.content= res.content.slice(1);

      //send notifications to the ids registerd by the server on this topic
      Meteor.call('sendNotificationsToTopicUsers', [this.topic_id,res.content], function(topic_id,content){});
    }
    if (Meteor.user().isAdmin() && res.content.charAt(0) === '*') {
      res.type = 'adminImage';
      res.content= res.content.slice(1);

      //send notifications to the ids registerd by the server on this topic
      Meteor.call('sendNotificationsToTopicUsers', [this.topic_id,"Advice from Chillbot"], function(topic_id,content){});
    }
    Logs.insert(res);
    // console.log(res);
    message.val('');
  },
  'click .plus' : function() {
    Topics.findOne(this.topic_id).addACount(Meteor.userId());
  }
});

Template.topicTimeline.helpers({
  my_score: function(){
    var my_score = Logs.find({user_id: Meteor.userId(), topic_id: this.topic_id, type: 'count'}).count();
    return my_score;
  },
  daily_logs:function() {
    var topic = Topics.findOne(this.topic_id);
    if(typeof topic !== 'undefined'){
      var daily_logs = topic.dailyLogs();
      if (daily_logs.length === 0) {
        //hack to have Today even if no log
        daily_logs =[[undefined,undefined]];
      }
    return daily_logs;
    }
  }
});

Template.daily_log.helpers({
  dayCount: function() {
    var count = 0;
    if (typeof this[1] !== 'undefined') {
      count = this[1];
    }
    var day = "Today";
    var today_string = moment(new Date()).format("MMM Do");
    if (typeof this[0] !== 'undefined') {
      day = this[0][0].formatted_day();
      if(day === today_string) {
        day = "Today";
      }
    }
    return day + ": <span class ='daily_score'>"+count+"</span>";
  },
  logs: function() {
    return this[0] ?this[0]:null;
  },
  topic: function(){
    return Topics.findOne(this[0][0].topic_id);
  },
  goalMessage: function (){
    var htmlGoalMessage = function(goal_message, success) {
      if(success){
        return "<span class='goal_success'>"+goal_message+"</span>";
      }else {
        return "<span class='goal_failure'>"+goal_message+"</span>";
      }
    };

    if(typeof this[0] !== 'undefined') {
      var topic = Topics.findOne(this[0][0].topic_id);
      var daily_goal = topic.dailyGoal(Meteor.userId());
      var goal_message = "";

      // console.log(daily_goal);
      if (typeof daily_goal !== 'undefined') {
        // console.log(daily_goal);
        if (typeof this[1] === 'undefined') {
          this[1]=0;
        }
        if (daily_goal.comparator === 'moreThan'){
          if (daily_goal.isReached(this[1])) {
            goal_message = htmlGoalMessage(
              "Congratz ! Goal exceeded by " + daily_goal.difference(this[1]),
              true);
          } else {
            goal_message = htmlGoalMessage(
              "Keep going, still " + daily_goal.difference(this[1]) + " to go !",
              false);
          }
        } else {//less than
          if (daily_goal.isReached(this[1])) {
            goal_message = htmlGoalMessage(
              "Congratz ! " + daily_goal.difference(this[1]) + " below your goal !",
              true);
          } else {
            goal_message = htmlGoalMessage(
              "Out of your goal by " + daily_goal.difference(this[1]),
              false);
          }
        }
      }
      return goal_message;
    }
  }
});

Template.log.events({
  'click .delete' : function(e,templ) {
    var topic_id = this.topic_id;
    this.remove();
    Topics.findOne(topic_id).resetScore();
  }
});

