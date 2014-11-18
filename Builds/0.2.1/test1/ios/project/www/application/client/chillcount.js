(function(){//Client side scripts
//

// Set ID of currently selected topic to null at the beginning
Session.setDefault('selected_topic_id', null);
Session.setDefault("logmessage", "No bluetooth on this device...");
Session.setDefault("bluetooth_status","");

Accounts.ui.config({
  requestPermissions: {
    facebook: ['public_profile','user_friends', 'email']
  }
});

var addACount = function(topic_id, user_id) {
  //We update the score count
  var my_score = Logs.find({user_id: user_id, topic_id: topic_id, type: 'count'}).count() +1;
  //On click on plus, we insert a new log in the db
  var timestamp = (new Date()).getTime();
  Logs.insert({
    topic_id: topic_id,
    user_id: user_id,
    type: 'count',
    timestamp: timestamp,
    score: my_score
  });

  //We update the score count
  var score = Logs.find({topic_id: topic_id, type: 'count'}).count();
  Topics.update(topic_id, {$set: {score: score}}); 
};

Template.layout.helpers ({
  logmessage: function (){
    return Session.get('logmessage');
  },
  beanWasDisconnected: function () {
    return (Session.get('bluetooth_status')==='bean_disconnected');
  }
});

Template.layout.events({
  'click #bluetooth_reconnect' : function(e){
    bleManager.retry();
  }
});

Template.topics_board.events({
  'click #add_topic' : function(e){
    // we prevent the form to relaod the page
    e.preventDefault();
    Router.go('topic_creation');
  }
});

//This is one way of defining a helper
Template.topic.selected = function () {
  return Session.equals("selected_topic_id", this._id) ? "selected" : '';
};

Template.topic.events({
  'click .plus': function () {
    addACount(this._id, Meteor.userId());
  },  
  'click .go': function () {
    Router.go("/topics/"+this._id);
  },
  'click .link_icon': function (){
    Session.set("selected_topic_id", this._id);
  }
});

Template.topic_creation.events({
  'click #new_topic' : function(e, templ) {
    //We stop the event from propagating
    e.preventDefault();
    //We take the value from the inputs
    var topic_name = templ.$("#topic_name").val();
    var topic_type = templ.$("#topic_type").html();
    var topic_description = templ.$("#topic_description").val();
    console.log(topic_name);
    console.log(topic_description);
    //We create the relevant new topic in the database
    var topic_id = Topics.insert({user_id: Meteor.userId(), name: topic_name, description:topic_description, type:topic_type, score: 0});
    Router.go('/topics/'+topic_id);
  },
  'click #cancel_new_topic' : function() {
    Router.go('/');
  }
});

Template.topic_creation_form.events({
  // quand clic sur img private , la source change a la nouvelle image et l'autre grise
  // idem pour l'img group
  'click #private_icon' : function(e, templ) {
    var private_icon = templ.$("#private_icon");
    var public_icon = templ.$("#public_icon");
    var topic_type = templ.$("#topic_type");
    private_icon.addClass("enabled");
    private_icon.removeClass("disabled");
    public_icon.addClass("disabled");
    public_icon.removeClass("enabled");
    topic_type.html("private");
  },

  'click #public_icon' : function(e, templ) {
    var private_icon = templ.$("#private_icon");
    var public_icon = templ.$("#public_icon");
    var topic_type = templ.$("#topic_type");
    public_icon.addClass("enabled");
    public_icon.removeClass("disabled");
    private_icon.addClass("disabled");
    private_icon.removeClass("enabled");
    topic_type.html("public");
  }


});

Template.topic_timeline.events({
  'click #back' : function(){
    Router.go("topics_board");
  },
  'click button#new_message' : function(e, templ) {
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
    Logs.insert(res);
    console.log(res);
    message.val('');
  },
  'click .plus' : function() {
    addACount(this.topic_id,Meteor.userId());
  }
});

//Useful logging of the template data

Template.topics_board.helpers({
  debug: function () {
    console.log(this);
  },
  beanIsConnected: function (){
    return Session.equals('bluetooth_status','bean_connected');
  }
});

Template.topic_timeline.helpers({
  debug: function () {
    console.log(this);
  },
  my_score: function(){
    var my_score = Logs.find({user_id: Meteor.userId(), topic_id: this.topic_id, type: 'count'}).count();
    return my_score;
  }
});

Template.login.helpers({
  goHome: function(){
    Router.go('topics_board');
  }
});

Template.topic.helpers({
  currentUserIsAdmin: function() {
    if (Meteor.user()) {
      return Meteor.user().isAdmin();      
    }
    else {
      return false;
    }
  },
  beanIsConnected: function (){
    return Session.equals('bluetooth_status','bean_connected');
  }
});

Template.count.isMine = function () {
  return (this.user_id === Meteor.userId()) ;
};

Template.message.isMine = function () {
  return (this.user_id === Meteor.userId()) ;
};

})();
