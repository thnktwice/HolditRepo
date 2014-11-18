Template.topic.helpers({
  selected: function() {
    return Session.equals("selected_topic_id", this._id) ? "selected" : '';    
  },
  creator_name: function(){
    var res = "me";
    if(Meteor.user()){
      if (Meteor.user().isAdmin() || (this.user_id !== Meteor.userId())){
        res = this.uname_topic();
      }
    }
    return res;
  },
  delete: function () {
    var res ="";
    if(Meteor.user()){
      if (Meteor.user().isAdmin() || (this.user_id == Meteor.userId())) {
        res="<a class='delete_topic'>delete?</a>";
      }
    }
    return res;
  }
});

Template.topic.events({
  'click .plus': function () {
    this.addACount(Meteor.userId());
  },  
  'click .go': function () {
    Router.go("/topics/"+this._id);
  },
  'click .link_icon': function (){
    if(Session.equals("selected_topic_id",this._id)){
      Session.set("selected_topic_id","");
    }else{
      Session.set("selected_topic_id", this._id);
    }
  },
  'click .add_to_my_topics': function () {
    Meteor.user().addToMyTopics(this._id);
  },
  'click .remove_from_my_topics': function () {
    Meteor.user().removeFromMyTopics(this._id);
  },
  'click .delete_topic': function (){
    if (confirm("Deleting this topic will remove all the users' data in it. Continue ?")){
      this.delete();
    }
  }
});