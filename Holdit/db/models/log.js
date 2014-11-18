// Logs -- {topic_id: string,
//            user_id: string,
//            timestamp: number
//            type: string
//            content: string,
//            score: integer}
Logs = new Mongo.Collection("logs");
Log = Model(Logs);

//Use a package library stupid models
Log.extend({
 defaultValues: {
  type:'count',
  content:''
 },
 uname_log: function() {
  return Users.findOne(this.user_id).uname_user();
 },
 formatted_time: function () {
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  dayWrapper = dayWrapper.format("HH:mm");
  var delete_html= "";
  if(Meteor.user().isAdmin() || this.user_id == Meteor.userId()){
    delete_html = " <a class='delete'>X</a> ";
  }
  return dayWrapper +delete_html;
 },
 formatted_day: function (){
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  return dayWrapper.format("MMM Do");
 },
 isMessage: function() {
  var res = (this.type === 'message');
  return res;
 },
 isCount: function() {
  var res = (this.type === 'count');
  return res;  
 },
 isAdminMessage: function() {
  // var res = ((typeof this.content !== 'undefined') && _.contains(admins,this.user_id) && (this.content.charAt(0)==='&'));
  var res = (this.type === 'adminMessage');
  return res;  
 },
 isAdminImage: function() {
  var res = (this.type === 'adminImage');
  return res;  
 },
 timedScore: function(){//return personal score at the log moment
  var count = Logs.find({
    user_id:this.user_id,
    topic_id:this.topic_id,
    timestamp:{$lt:this.timestamp},
    type: 'count'
  }).count();

  if(this.type =='count'){
    count = count+1;
  }
  return count;
 }
});

