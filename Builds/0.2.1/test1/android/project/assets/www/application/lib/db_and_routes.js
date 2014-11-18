(function(){//We define the admins
var admins =["m.coenca", "dbaruchel", "thomasbazeille"];


//We define our DBs
//Topics - {user_id: string
//          name:string,
//          type:private or public
//          description:string, 
//          score:integer}
Topics = new Mongo.Collection("topics");
Topic = Model(Topics);

Topic.extend({
  uname: function() {
    var user = Meteor.users.findOne({_id: this.user_id});
    return user.uname();
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
  }
});
// Logs -- {topic_id: string,
//            user_id: string,
//            timestamp: number
//            type: string
//            content: string,
//            score: integer}
Logs = new Mongo.Collection("logs");
Log = Model(Logs);

//Use a package library stupid models
Log.extend({
 defaultValues: {
  type:'count',
  content:''
 },
 uname: function() {
  var user = Meteor.users.findOne({_id: this.user_id});
  return user.uname();
 },
 formatted_time: function () {
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  return dayWrapper.format("MMM Do, HH:mm");

  //.toLocaleDateString() + " " + new Date(this.timestamp).toLocaleTimeString();
 },
 isMessage: function() {
  var res = (this.type === 'message');
  return res;
 },
 isCount: function() {
  var res = (this.type === 'count');
  return res;  
 },
 isAdminMessage: function() {
  // var res = ((typeof this.content !== 'undefined') && _.contains(admins,this.user_id) && (this.content.charAt(0)==='&'));
  var res = (this.type === 'adminMessage');
  return res;  
 }
});

Users = Meteor.users;
User = Model(Users);

User.extend({
  isAdmin: function() {
  var res = (_.contains(admins,this.profile.username));
  return res;      
  },
  uname: function() {
    // !! FACEBOOK AND OTHER LOGIN NOT WORKING IN PRODUCTION SERVER
    // var first_name = this.profile.name.split(' ')[0];
    // var last_name_initial = this.profile.name.split(' ').slice(-1).join(' ').charAt(0);
    // return first_name +" "+ last_name_initial;
    var username = this.profile.username;
    return username;
  },
  setDevice: function(device_token, device_type) {
    if (this.profile.device_token !== device_token){
      Meteor.users.update({_id:this._id}, {$set:{"profile.device_token":device_token, "profile.device_type":device_type}});
      return true; 
    }
    else {
      return 'same token !';
    }
  }
});

//We route the pages
Router.map(function() {

  this.route('login',{
    layoutTemplate: 'layout'
  });

  this.route('topic_creation',{
    layoutTemplate: 'layout'
  });
  //This will render the topics board template
  this.route('topics_board', {
    path: '/',
    layoutTemplate: 'layout',
    onBeforeAction: function () {
      //We "prefilter" if the user is logging in order to redirect to the good page
      if (Meteor.user() === null){
        if(!Meteor.loggingIn()){
          Router.go('login');
        }
      }
    },
    data: function(){
      var topics_board_data;
      if (Meteor.user() && Meteor.user().isAdmin()){
        topics_board_data = {
          topics: Topics.find({}, {sort: {score: -1, name: 1}})
        };
      }
      else{
        topics_board_data = {
          topics: Topics.find({$or: [{user_id: Meteor.userId()}, {type: 'public'}]}, {sort: {score: -1, name: 1}})
        };
      }
      return topics_board_data;
    }
  });

  //this will render the topic timeline, with the relevant data
  this.route('topic_timeline', {
    path:'/topics/:id',
    layoutTemplate: 'layout',
    notFoundTemplate: 'page_not_found',
    //Returns the relevant data to the template
    //It will then understand what it is about
    data: function() {

      var timeline_data;
      var topic = Topics.findOne(this.params.id);
      if(typeof topic !== 'undefined') {
        timeline_data = {
          topic_id: this.params.id,
          name: topic.name,
          logs: Logs.find({topic_id: this.params.id}, {sort: {timestamp: -1}}),
          score: topic.score,
          description: topic.description
        };      
      }
      return timeline_data;
    }
  });
});

})();
