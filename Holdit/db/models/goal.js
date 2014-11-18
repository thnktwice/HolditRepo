// DailyGoals -- {topic_id: string,
//            user_id: string,
//            timestamp: number
//            comparator: string
//            value: number}
DailyGoals = new Mongo.Collection("dailygoals");
DailyGoal = Model(DailyGoals);

DailyGoal.extend({
 defaultValues: {
  comparator:'moreThan'
 },
 user: function() {
  var user = Meteor.users.findOne({_id: this.user_id});
  return user;
 },
 formatted_time: function () {
  var day = new Date(this.timestamp);
  var dayWrapper = moment(day);
  return dayWrapper.format("MMM Do, HH:mm");

  //.toLocaleDateString() + " " + new Date(this.timestamp).toLocaleTimeString();
 },
 isReached: function(count) {//Are you in your objective for the day ?
  check(count, Number);
  if (this.comparator === 'moreThan') {
    return (count > this.value);
  }else if (this.comparator === 'lessThan') {
    return (count < this.value);
  }
 },
 difference: function (count){//How are you far from your goal
  check (count, Number);
  return (Math.abs(count-this.value));
 }
});