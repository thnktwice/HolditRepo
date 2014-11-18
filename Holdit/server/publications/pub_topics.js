// Publish complete set of topics to all clients.
Meteor.publish('topics', function () {
  this.unblock();
  if(this.userId) {
    if (Meteor.users.findOne(this.userId).isAdmin()){
      return Topics.find();
    }else{
      return Topics.find({$or: [
        {user_id:this.userId},
        {type:'public'}]}
      );
    }
  }else{
    return [];
  }
});