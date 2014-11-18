Meteor.startup(function () {
  if (Meteor.isCordova) {
    // alert("is cordova 10");
    if(bleManager.isAvailable()) {
      Meteor.setTimeout(bleManager.setup,1000);       
    }


    Tracker.autorun(function(){ 
      if(Meteor.user()){
        console.log("USERRR");
        pushStuff.registerForNotifications();
      }
    });
  }
});