 Meteor.startup(function(){
  //Android notifications
  var gcm = Meteor.npmRequire('node-gcm');

  var sender = new gcm.Sender('AIzaSyCZL1dvqOyyRrULR_hjACsWQKQlZrdqO4s');

  sendAndroidNotifications = function (topic_id,content) {
    console.log("ANDROID NOTIF");
    var topic = Topics.findOne(topic_id);
    var registrationIds = topic.androidUserDeviceTokens();
    
    // or with object values
    console.log(registrationIds);
    var message = new gcm.Message({
        collapseKey: 'Chillbot',
        // delayWhileIdle: true,
        // timeToLive: 3,
        data: {
            title: 'Chillbot',
            message: "@"+topic.name+":" + content,
            msgcnt: 1
        }
    });

    console.log('MESS' +message);
    /**
     * Params: message-literal, registrationIds-array, No. of retries, callback-function
     **/
    sender.send(message, registrationIds, 4, function (err, result) {
        console.log(result);
        console.log(err);
    });
  };
 });
