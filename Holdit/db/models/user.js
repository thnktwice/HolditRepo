Users = Meteor.users;
User = Model(Users);

var admins =["m.coenca", "dbaruchel", "thomasbazeille"];

User.extend({
  isAdmin: function() {
  var res = (_.contains(admins,this.profile.username));
  return res;      
  },
  uname_user: function() {
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
  },
  addToMyTopics: function(topic_id){
    if (typeof MyTopics.findOne({user_id:this._id, topic_id:topic_id}) === 'undefined') {
      MyTopics.insert({
          user_id:this._id,
          topic_id:topic_id
      });  
    }
    return _.pluck(MyTopics.find({user_id:this._id}).fetch(),"topic_id");
  },
  removeFromMyTopics: function (topic_id) {
    MyTopics.findOne({
      user_id:this._id,
      topic_id:topic_id
    }).delete();
  }
});