Router.map(function() {
  this.route('login', {
    layoutTemplate: 'layout'
  });

  this.route('topicCreation', {
    layoutTemplate: 'layout'
  });
  //This will render the topics board template
  this.route('topicsBoard', {
    path: '/',
    layoutTemplate: 'layout',
    onBeforeAction: function() {
      //We "prefilter" if the user is logging in order to redirect to the good page
      if (Meteor.user() === null) {
        if (!Meteor.loggingIn()) {
          Router.go('login');
        }else{
          this.next();
        }
      }else{
        this.next(); 
      } 
    },
    data: function() {
      var topics_board_data;
      if (Session.equals('topic_view', 'mine')) { //Mine view
        if (Meteor.user()) {
          var my_topics_keys = _.pluck(MyTopics.find({
            user_id: Meteor.userId()
          }).fetch(), 'topic_id');
          topics_board_data = {
            topics: Topics.find({
              _id: {
                $in: my_topics_keys
              }
            }, {
              sort: {
                score: -1,
                name: 1
              }
            })
          };
        }
      } else { //All view
        if (Meteor.user() && Meteor.user().isAdmin()) {
          topics_board_data = {
            topics: Topics.find({}, {
              sort: {
                score: -1,
                name: 1
              }
            })
          };
        } else {
          topics_board_data = {
            topics: Topics.find({
              $or: [{
                user_id: Meteor.userId()
              }, {
                type: 'public'
              }]
            }, {
              sort: {
                score: -1,
                name: 1
              }
            })
          };
        }
      }
      return topics_board_data;
    },
    fastRender: true
  });

  //this will render the topic timeline, with the relevant data
  this.route('topicTimeline', {
    path: '/topics/:id',
    layoutTemplate: 'layout',
    notFoundTemplate: 'page_not_found',
    //Returns the relevant data to the template
    //It will then understand what it is about
    data: function() {

      var timeline_data;
      var topic = Topics.findOne(this.params.id);
      if (typeof topic !== 'undefined') {
        //Here we process the data of the topic
        // var daily_logs = topic.dailyLogs();
        // if (daily_logs.length === 0) {
        //   //hack to have Today even if no log
        //   daily_logs =[[undefined,undefined]];
        // }

        timeline_data = {
          topic_id: this.params.id,
          name: topic.name,
          // daily_logs: daily_logs,
          score: topic.score,
          description: topic.description
        };
      }
      return timeline_data;
    }
  });

  this.route('topicStats', {
    path: '/topics/:id/stats',
    layoutTemplate: 'layout',
    notFoundTemplate: 'page_not_found',
    data: function() {
      var stats_data;
      var topic = Topics.findOne(this.params.id);
      var goal = DailyGoals.findOne({
        topic_id: this.params.id,
        user_id: Meteor.userId()
      });
      if (typeof topic !== 'undefined') {
        if (typeof goal === 'undefined') {
          var timestamp = (new Date()).getTime();
          DailyGoals.insert({
            topic_id: this.params.id,
            user_id: Meteor.userId(),
            comparator: "moreThan",
            timestamp: timestamp
          });
        }
        stats_data = {
          topic_id: this.params.id,
          name: topic.name,
          goal: goal,
          my_logs: Logs.find({
            topic_id: this.params.id,
            user_id: Meteor.userId()
          })
        };
      }
      return stats_data;
    }
  });
});