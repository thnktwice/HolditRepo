Meteor.startup(function(){
  //iOS
  //Enable push notification by adding the relevant package
  var apn = Meteor.npmRequire("apn");
  var path = Npm.require('path');
  var apnOptions = Meteor.settings.apnOptions || {};
  var alertSound = apnOptions.sound || "alert.aiff";
  var apnConnection;

  // default apn connection options
  // var cert = Assets.getText("cert.pem");
  var cert = Assets.getText("tiltProdCert.pem");
  var key = Assets.getText("key.pem");
  var ca = Assets.getText("entrust_2048_ca.cer");
  // console.log(cert);
  // console.log(key);
  apnOptions = _.extend(
    {
    cert: cert,
    key: key,
    ca: ca,
    passphrase: 'cristohoger24',
    production: true
    }, 
    apnOptions);
  // console.log(apnOptions);

  apnConnection = new apn.Connection(apnOptions);

  sendAppleNotifications = function (topic_id, content) {
    console.log("sendAppleNotifications");
    var note = new apn.Notification();

    var topic = Topics.findOne(topic_id);
    var pushIds = topic.appleUserDeviceTokens();
    // expires 1 hour from now
    note.expiry = Math.floor(Date.now() / 1000) + 3600;
    note.badge = 1;
    note.sound = alertSound;
    note.alert = "@"+topic.name+":" + content;
    note.payload = {'url': "/topics/"+topic_id};


    _.each(pushIds, function (token) {
      var device = new apn.Device(token);
      console.log("sending notification to +" + token );
      console.log(note);
      apnConnection.pushNotification(note, device);
    });

    return {success:'ok'};
  }; // end sendAppleNotifications

});