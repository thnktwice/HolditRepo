Template.layout.events({
  'click #bluetooth_reconnect' : function(e){
    bleManager.retry();
  }
});