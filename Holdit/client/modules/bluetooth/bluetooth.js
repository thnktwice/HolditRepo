if (Meteor.isCordova) {
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
    var beanScratchTwoCharacteristicUuid = "a495ff22-c5b1-4b44-b512-1370f02d74de";

    var scanTimer = null;
    var connectTimer = null;
    var reconnectTimer = null;

    var iOSPlatform = "iOS";
    var androidPlatform = "Android"; 

    var bluetoothLogging = function (logmessage) {
      if (logmessage === "isDisconnected : Device is disconnected"){
        Session.set("logmessage", "ChillButton has been disconnected :( Please try the above with your ChillButton nearby, or close then restart your application.");
        Session.set("bluetooth_status","bean_disconnected");
        //We try to reconnect directly without asking
        Meteor.setTimeout(reconnect,3000);
      // } else if ("Connection timed out"){
      //   Session.set("logmessage","No Bean was detected around, and connection timed out. Maybe the battery was low ! Reset to be sure or call 911");
      //   Session.set("bluetooth_status","bean_disconnected");
      // } else if (logmessage === "Reconnection timed out") {
      //   Session.set("logmessage","Reconnection timed out. You must be trying to reconnect to a different bean than last time. Reset ");
      //   Session.set("bluetooth_status","bean_disconnected");
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
        Session.set("bluetooth_status","bean_connected");
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

    var respondToResultSuccessCallback = function(success) {
      // alert("write success");
    };

    var respondToResult = function (topic_id,user_id){//Send feedback message on log working

      //TODO REFACTOR THIS
      // alert("sending result");
      var u8 = new Uint8Array(1);
      u8[0]= 1; //blue => you can keep counting by default

      var topic = Topics.findOne(topic_id);
      var dailyGoal = topic.dailyGoal(user_id);

      var count = 0;
      if(typeof topic.dailyLogs()[0] !== 'undefined'){//if the topic has logs today
        count = topic.dailyLogs()[0][1];
      }
      
      if(typeof dailyGoal !== 'undefined') {//if there is a goal set
        var goalType = dailyGoal.comparator;
        if(goalType =='moreThan'){
          if(dailyGoal.isReached(count+1)) {//+1 because of the latency and the no callback approach right now
            u8[0] = 3;//green hero
          }
        } else if(goalType =='lessThan') {
          if (!dailyGoal.isReached(count+1)){
            u8[0] = 4;//red and buzzer because you exceeded your goal
          }
        }
      }
      // alert(u8[0]);

      var value = bluetoothle.bytesToEncodedString(u8);
      var params = {
        "value":value,
        "serviceUuid":beanScratchServiceUuid,
        "characteristicUuid":beanScratchTwoCharacteristicUuid,
        "type":"noResponse"
      };
      bluetoothle.write(respondToResultSuccessCallback, error, params);
    };

    var subscribeToScratchOneSuccess = function (successReturn) {
      if (successReturn.status === "subscribed") {
        bluetoothLogging("Subscribed to the ChillButton ! You can log safely");
        Session.set("bluetooth_status","bean_connected");
      }
      else if (successReturn.status === "subscribedResult") {
        // bluetoothLogging("ChillButton subscrition..." + successReturn.value);
        var hexVal = successReturn.value;
        var unit8ArrayVal = bluetoothle.encodedStringToBytes(hexVal);
        var intVal = unit8ArrayVal["0"];
        // alert(JSON.stringify(unit8ArrayVal));
        bluetoothLogging('Chillbutton was clicked and sent the message : (' + intVal +'). Link it to a topic to see it actually work !');
        // navigator.vibrate(3000);
        // alert("inrmotecount1");
        // alert(Session.get('selected_topic_id'));
        // alert(Meteor.userId());
        var topic_id = Session.get('selected_topic_id');
        var user_id = Meteor.userId();  
        Meteor.call('addARemoteCount', [topic_id,user_id], function(topic_id,user_id){
        });
        respondToResult(topic_id,user_id);
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
          bluetoothLogging("Bluetooth init success");
          var params = {"serviceUuids": beanServiceUuid};
          bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
      }
      else {
        bluetoothLogging("Unexpected initialize status: " + successReturn.status);
      }
    };

    //Functions used in the retry
    var retryClose = function () {
      bluetoothle.close(function(closeSuccess){
        if (closeSuccess.status == 'closed'){
          bluetoothLogging("BLE closed successfully...restarting ble");
          //restart from the beginning
          bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
        } else{
          bluetoothLogging("Unexpected ble close status " +closeSuccess.status);
        }
      }, function(closeError){
        bluetoothLogging("Close error: " + closeError.error + " - " + closeError.message);
      });
    };

    var  retryDisconnectSuccess = function(obj){
      if (obj.status == "disconnected") {
        bluetoothLogging("Disconnected successfully");
        retryClose();
      }
      else if (obj.status == "disconnecting") {
        bluetoothLogging("Disconnecting device...");
      }
      else { 
        bluetoothLogging("Unexpected disconnect status: " + obj.status);
      }
    };

    var  retryDisconnectError = function(obj) {
      bluetoothLogging("Disconnect error: " + obj.error + " - " + obj.message);
    };


    var myself = {
      setup: function(){
        // alert("setup");
        bluetoothle.initialize(initializeSuccessCallback, error, {request:true});
      },
      retry: function() {
        // closeDevice();
        // if (Session.equals('logmessage',"ChillButton has been disconnected :( Please try the above with your ChillButton nearby, or close then restart your application.")) {//if it is just a temporary disconnect
        bluetoothle.isConnected(function(obj){
          if(obj.isConnected===true) {
            bluetoothLogging("ble is connected");
            //Disconnect before scanning again
            bluetoothle.disconnect(retryDisconnectSuccess,retryDisconnectError);
          } else {
            bluetoothle.isInitialized(function(obj2){
//WATCH OUT FOR isInitAlized
              if(obj2.isInitalized===true){
                bluetoothLogging("ble is init,starting scan");
                //rescan
                bluetoothle.startScan(startScanSuccessCallback, error, {'serviceUuids':[]});
              }else {
                //e close  directly
                retryClose();
              }
            });
          }
        });
        // } else{
        //   closeDevice();
        //   initializeSuccessCallback({'status':'enabled'});
        // }
      },
      write: function(value) {
        writeValue(value);
      },
      isAvailable: function() {
        //Not sure exactly what to put for ios

        var androidMinimalVersion = [4,3];

        if(device.platform === androidPlatform) {
          var version = device.version;
          var digits = version.split(".");
          digits = _.map(digits,function(dig){return parseInt(dig);});
          var length = Math.min(androidMinimalVersion.length,digits.length);
          var res = true;
          for (var i=0;i<length;i++){
            if (digits[i] > androidMinimalVersion[i]) {
              break;
            }else if (digits[i] < androidMinimalVersion[i]){
              res = false;
              break;
            }
          }
          return res;
        } else {//if ios or windows phone...
          return true;
        }
      }
    };

    return myself;

  }.call();  
}
