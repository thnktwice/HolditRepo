if (Meteor.isCordova) {
  //We do not put var so that is a global variable
  pushStuff = function () {

    var iOSPlatform = "iOS";
    var androidPlatform = "Android"; 

    //pour le push
    var pushSuccessHandler = function (result) { 
      //alert('pushResult = ' + result); 
    };

    var pushErrorHandler = function (error) { 
      alert('pushError = ' + error); 
    };

    var pushTokenHandler = function (result) { 
      //alert('iOS device token = ' + result); 
      Meteor.user().setDevice(result, 'iOS');
    };

    var successHandler = function (result) {
      //alert('Res'+result);
      //alert(onNotificationG);
    };

    var myself = {

      registerForNotifications:function () {
        // alert("registerForNotifications");

        var pushNotification = window.plugins.pushNotification;
        console.log("REGISTERRR");

        if (device.platform === androidPlatform) {
          //alert("registering");
          pushNotification.register(
          successHandler,
          pushErrorHandler,
          {
              "senderID":"808404171645",
              "ecb":"onNotificationG"
          });        
        } else {
          pushNotification.register(
            pushTokenHandler,
            pushErrorHandler,
            {
            "badge":"true",
            "sound":"true",
            "alert":"true",
            "ecb":"onNotificationAPN"
            }
          );        
        }

      }
    };

    return myself;

  }.call();  
}
