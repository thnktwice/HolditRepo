Template.topicGoals.helpers({
  moreIsSelected: function(){
    if(this.goal) {
      return (this.goal.comparator === 'moreThan' ? 'selected' : null );
    }
    return '';
  },
  lessIsSelected: function(){
    if(this.goal) {
      return (this.goal.comparator === 'lessThan' ? 'selected' : null );
    }
    return null;
  }
});

Template.topicStats.events({
  'change #goal_comparator': function(event,templ){
    var value = templ.$('#goal_comparator').val();
    if (value === 'more'){
      this.goal.update({'comparator':'moreThan'});
    } else{
      this.goal.update({'comparator':'lessThan'});
    }
  },
  'change #goal_value': function(event,templ){
    var value = templ.$('#goal_value').val();
    this.goal.update({'value':value});
  },
  'click #go_timeline' : function(event, templ) {
    Router.go('/topics/'+this.topic_id);
  },
  'click #back' : function (event,templ){
    Router.go("topicsBoard");
  }
});