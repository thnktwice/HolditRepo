Meteor.startup(function(){

  //We define helpers function for our Methods API for the client
  var sendNotifications = function (topic_id, content) {
    sendAppleNotifications(topic_id,content);
    sendAndroidNotifications(topic_id,content);
  };



  //Declare the methods on the server that can be accessed by the client
  Meteor.methods({
    sendNotificationsToTopicUsers: function(args) {
      console.log("sendNotificationsToTopicUsers");
      //topic_id, content
      sendNotifications(args[0],args[1]);
    },
    addARemoteCount: function(args){
      //topic_ic, user_id
      Topics.findOne(args[0]).addACount(args[1]);
      // addACount(args[0],args[1]);
    }
  });  
}); 

