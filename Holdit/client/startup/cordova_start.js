Meteor.startup(function () {
  if (Meteor.isCordova) {
    //Defaults forCordova startup

    // if(bleManager.isAvailable()) {
    //   Meteor.setTimeout(bleManager.setup,1000);       
    // }


    // Tracker.autorun(function(){ 
    //   if(Meteor.user()){

    //     pushStuff.registerForNotifications();
    //   }
    // });
  }
});