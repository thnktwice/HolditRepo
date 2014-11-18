(function(){//Cordova code
//
//
var pushStuff = function () {

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

bleManager = function() {
  //the device package is useful because configuration of the bluetooth 
  //is different in android and in iod

  var addressKey = "beanAddress";

  var beanServiceUuid = "";
  var beanCharacteristicUuid = "";
  var clientCharacteristicConfigDescriptorUuid = "";
  var batteryServiceUuid = "180f";
  var batteryLevelCharacteristicUuid = "2a19";

  var beanScratchServiceUuid = "a495ff20-c5b1-4b44-b512-1370f02d74de";
  var beanScratchOneCharacteristicUuid = "a495ff21-c5b1-4b44-b512-1370f02d74de";

  var scanTimer = null;
  var connectTimer = null;
  var reconnectTimer = null;

  var iOSPlatform = "iOS";
  var androidPlatform = "Android"; 

  var bluetoothLogging = function (logmessage) {
    if (logmessage === "isDisconnected : Device is disconnected"){
      Session.set("logmessage", "ChillButton has been disconnected :( Please try the above with your ChillButton nearby, or close then restart your application.");
      Session.set("bluetooth_status","bean_disconnected");
    }
    else{
      Session.set("logmessage", logmessage);
    }
  };

  var error = function (error_message) {
    bluetoothLogging(error_message.error + " : " + error_message.message);
  };

  var stopScanSuccess = function (successReturn) {
    if (successReturn.status === "scanStopped") {
      bluetoothLogging("Scan was stopped successfully");
    } 
    else {
      bluetoothLogging("Unexpected stop scan status: " + successReturn.status);
    }
  };

  var scanTimeout = function () {
    bluetoothLogging("Scanning time out, stopping");
    bluetoothle.stopScan(stopScanSuccess, error);
  };

  var clearScanTimeout = function () {
    bluetoothLogging("Clearing scanning timeout");
    if (scanTimer !== null) {
      Meteor.clearTimeout(scanTimer);
    }
  };

  var connectTimeout = function () {
    bluetoothLogging("Connection timed out");
  };

  var clearConnectTimeout = function () { 
    bluetoothLogging("Clearing connect timeout");
    if (connectTimer !== null) {
      Meteor.clearTimeout(connectTimer);
    }
  };

  var tempDisconnectDevice = function () {
    bluetoothLogging("Disconnecting from device to test automatic reconnection");
    bluetoothle.disconnect(tempDisconnectSuccess, error);
  };

  var tempDisconnectSuccess = function (successReturn) {
    if (successReturn.status === "disconnected") {
      bluetoothLogging("Temp disconnect device and reconnecting in 1 second. Instantly reconnecting can cause issues");
      Meteor.setTimeout(reconnect, 1000);
    } 
    else if (successReturn.status === "disconnecting") {
     bluetoothLogging("Temp disconnecting device");
    } 
    else {
      bluetoothLogging("Unexpected temp disconnect status: " + successReturn.status);
    }
  };

  var reconnect = function () {
    bluetoothLogging("Reconnecting with 3 second timeout");
    bluetoothle.reconnect(reconnectSuccess, reconnectError);
    reconnectTimer = Meteor.setTimeout(reconnectTimeout, 3000);
  };

  var discoverSuccess = function (successReturn){
    if (successReturn.status === 'discovered'){
      bluetoothLogging("devices discovery...");
      var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuid":beanScratchOneCharacteristicUuid, "isNotification": true};
      bluetoothle.subscribe(subscribeToScratchOneSuccess, reconnectError,params);
    }
  };

  var clearReconnectTimeout = function() { 
    bluetoothLogging("Clearing reconnect timeout");
    if (reconnectTimer !== null) {
      Meteor.clearTimeout(reconnectTimer);
    }
  };

  var reconnectSuccess = function (successReturn) {
    if (successReturn.status === "connected") {
      bluetoothLogging("Reconnected to : " + successReturn.name + " - " + successReturn.address);
      clearReconnectTimeout();
      if (device.platform === iOSPlatform) {
        bluetoothLogging("Let's discover the Bean Services my little iOS friend !");
        // var params = {"serviceUuids":batteryServiceUuid};
        // bluetoothle.services(beanBatteryService, error, params);
        var params ={};
        bluetoothle.services(beanService,error,params);
      }
      else if (device.platform === androidPlatform) {
        bluetoothLogging('Lets go discover then little Android Friend !');
        bluetoothle.discover(discoverSuccess, error);
      }
    } 
    else if (successReturn.status === "connecting") {
      bluetoothLogging("Reconnecting to : " + successReturn.name + " - " + successReturn.address);
    } 
    else {
      bluetoothLogging("Unexpected reconnect status: " + successReturn.status);
      disconnectDevice();
    }
  };

  var reconnectError = function (error_message) {
    error(error_message);
    disconnectDevice();
  };

  var reconnectTimeout = function() {
    bluetoothLogging("Reconnection timed out");
  };

  var suscribToBatterySuccess = function (successReturn) {
    if (successReturn.status === "subscribed") {
      bluetoothLogging("Suscribed to battery pop pop");
    }
    else if (successReturn.status === "subscribedResult") {
      bluetoothLogging("Suscribed result");
    }
  };

  var subscribeToScratchOneSuccess = function (successReturn) {
    if (successReturn.status === "subscribed") {
      bluetoothLogging("Subscribed to the ChillButton ! You can log safely");
      Session.set("bluetooth_status","bean_connected");
    }
    else if (successReturn.status === "subscribedResult") {
      // bluetoothLogging("ChillButton subscrition..." + successReturn.value);
      bluetoothLogging('Chillbutton was clicked and sent the message : (' +successReturn.value +'). Link it to a topic to see it actually work !');
      // alert("inrmotecount1");
      // alert(Session.get('selected_topic_id'));
      // alert(Meteor.userId());
      var topic_id = Session.get('selected_topic_id');
      var user_id = Meteor.userId();  
      Meteor.call('addARemoteCount', [topic_id,user_id], function(topic_id,user_id){});
    }
  };

  var readSuccessCallback = function (successReturn) {
    bluetoothLogging("Reading");
    bluetoothLogging(JSON.stringify(successReturn));
  };

  var characteristicsBatterySuccess = function (successReturn) {
    if (successReturn.status == "discoveredCharacteristics"){
      bluetoothLogging("characteristics discovered..");
      var characteristicUuids = successReturn.characteristicUuids;
      bluetoothLogging(JSON.stringify(successReturn));
      for (var i = 0; i < characteristicUuids.length; i++){
        bluetoothLogging("Battery Characteristics found");
        var characteristicUuid = characteristicUuids[i];
        if (characteristicUuid === batteryLevelCharacteristicUuid) {
          bluetoothLogging("Battery level characteristic found, suscribing...");
          var params = {"serviceUuid":batteryServiceUuid, "characteristicUuid":batteryLevelCharacteristicUuid, "isNotification": true};
          // bluetoothle.subscribe(suscribToBatterySuccess,reconnectError,params);
          bluetoothle.read(readSuccessCallback, reconnectError, params);
        }
      }
    }
  };

  var characteristicsScratchOneSuccess = function (successReturn) {
    if (successReturn.status == "discoveredCharacteristics") {
      bluetoothLogging("characteristics discovered");
      var characteristicUuids = successReturn.characteristicUuids;
      for (var i = 0; i < characteristicUuids.length; i++) {
        var characteristicUuid = characteristicUuids[i];
        if (characteristicUuid === beanScratchOneCharacteristicUuid) {
          bluetoothLogging("Chillbutton characteristic found, suscribing...");
          var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuid":beanScratchOneCharacteristicUuid, "isNotification": true};
          bluetoothle.subscribe(subscribeToScratchOneSuccess, reconnectError,params);
        }
      }
    }
  };

  var beanBatteryService = function (successReturn) {
    if (successReturn.status === 'discoveredServices') {
      var serviceUuids = successReturn.serviceUuids;
      for (var i = 0; i < serviceUuids.length; i++) {
        var serviceUuid = serviceUuids[i];
        if (serviceUuid === batteryServiceUuid) {
          bluetoothLogging("Finding battery characteristics");
          var params = {"serviceUuid":batteryServiceUuid, "characteristicUuids":batteryLevelCharacteristicUuid};
          bluetoothle.characteristics(characteristicsBatterySuccess, reconnectError, params);
          return;
        }
      }
      bluetoothLogging("Error: battery service not found");
    }
    else {
      bluetoothLogging("Unexpected services battery: " + successReturn.status);
      disconnectDevice();      
    }
  };

  var beanService = function (successReturn) {
    if (successReturn.status === 'discoveredServices') {
      var serviceUuids = successReturn.serviceUuids;
      var found= false;
      for (var i = 0; i < serviceUuids.length; i++) {
        var serviceUuid = serviceUuids[i];
        bluetoothLogging(serviceUuid);
        // if (serviceUuid === batteryServiceUuid) {
        //   bluetoothLogging("Finding battery characteristics");
        //   var params = {"serviceUuid":batteryServiceUuid, "characteristicUuids":batteryLevelCharacteristicUuid};
        //   bluetoothle.characteristics(characteristicsBatterySuccess, reconnectError, params);
        //   return;
        // }
        if (serviceUuid === beanScratchServiceUuid) {
          bluetoothLogging("finding Chillbutton service on the Bean...");
          found = true;
          var params = {"serviceUuid":beanScratchServiceUuid, "characteristicUuids":beanScratchOneCharacteristicUuid};
          bluetoothle.characteristics(characteristicsScratchOneSuccess, reconnectError, params);
        }
      }
      if(!found){
        bluetoothLogging("Bean not found...check if you another are not already connected");
      }
    }
    else {
      bluetoothLogging("Unexpected services battery: " + successReturn.status);
      disconnectDevice();      
    }
  };

  var disconnectDevice = function() {
    bluetoothle.disconnect(disconnectSuccess, error);
  };

  var disconnectSuccess = function(successReturn) {
    if (successReturn.status === "disconnected") {
      bluetoothLogging("Disconnect device");
      Session.set("bluetooth_status","");
      closeDevice();
    } 
    else if (successReturn.status === "disconnecting") {
      bluetoothLogging("Disconnecting device");
    } 
    else {
      bluetoothLogging("Unexpected disconnect status: " + successReturn.status);
    }
  };

  var closeDevice = function() {
    bluetoothle.close(closeSuccess, error);
  };

  var closeSuccess = function(successReturn) {
    if (successReturn.status === "closed") {
      bluetoothLogging("Device closed...");
      initializeSuccessCallback({status:'enabled'});
    } 
    else {
      bluetoothLogging("Unexpected close status: " + successReturn.status);
    }
  };

  var closeError = function(successReturn) {
    bluetoothLogging("Close error: " + obj.error + " - " + obj.message);
  };

  var connectError = function (error_message) {
    bluetoothLogging("Connect error: " + obj.error + " - " + obj.message);
    clearConnectTimeout();
  };

  var connectSuccess = function(successReturn) {
    if (successReturn.status === "connected") {
      bluetoothLogging("Connected to : " + successReturn.name + " - " + successReturn.address);
      clearConnectTimeout();
      tempDisconnectDevice();
    } 
    else if (successReturn.status === "connecting") {
      bluetoothLogging("Connecting to : " + successReturn.name + " - " + successReturn.address);
    } 
    else {
      bluetoothLogging("Unexpected connect status: " + successReturn.status);
      clearConnectTimeout();
    }
  };

  var connectDevice = function (address) {
    bluetoothLogging("Begining connection to: " + address + " with 5 second timeout");
    var params = {"address":address};
    bluetoothle.connect(connectSuccess, error, params);
    connectTimer = Meteor.setTimeout(connectTimeout, 5000);
  };

  var startScanSuccessCallback = function (successReturn) {
    if (successReturn.status === 'scanStarted') {
      bluetoothLogging("Scan was started successfully, stopping in 10");
      scanTimer = Meteor.setTimeout(scanTimeout, 10000);
    } 
    else if (successReturn.status === 'scanResult') {
      if(successReturn.name === 'Bean') {
        bluetoothLogging("Bean "+ successReturn.address + " detected. Stopping scan");
        bluetoothle.stopScan(stopScanSuccess, error);
        clearScanTimeout();
        window.localStorage.setItem(addressKey, successReturn.address);
        connectDevice(successReturn.address);
      }
    }
    else {
      bluetoothLogging("Unexpected status: " + successReturn.status);
    }
  };

  var initializeSuccessCallback = function (successReturn) {
    if (successReturn.status === 'enabled') {
      var address = window.localStorage.getItem(addressKey);
      if (address === null){
        bluetoothLogging("Bluetooth init success");
        var params = {"serviceUuids": beanServiceUuid};
        bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
      }
      else {
        connectDevice(address);
      }
    }
    else {
      bluetoothLogging("Unexpected initialize status: " + successReturn.status);
    }
  };

  var myself = {
    setup: function(){
      bluetoothle.initialize(initializeSuccessCallback, error, {request:true});
    },
    retry: function() {
      // closeDevice();
      reconnect();
    }
  };

  return myself;

}.call();

//Here we call the above function
Meteor.startup(function () {
  if (Meteor.isCordova) {
    // alert("is cordova 10");
    Meteor.setTimeout(bleManager.setup,1000);

    Tracker.autorun(function(){ 
      if(Meteor.user()){
        console.log("USERRR");
        pushStuff.registerForNotifications();
      }
    });
  }
});

})();
