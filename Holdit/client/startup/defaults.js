Meteor.startup(function(){
  Session.setDefault('selected_topic_id', null);
  Session.setDefault("logmessage", "No bluetooth on this device...");
  Session.setDefault("bluetooth_status","");  
  Session.setDefault("topic_view","all");
});