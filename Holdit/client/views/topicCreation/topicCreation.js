Template.topicCreation.events({
  'click #new_topic' : function(e, templ) {
    //We stop the event from propagating
    e.preventDefault();
    //We take the value from the inputs
    var topic_name = templ.$("#topic_name").val();
    var topic_type = templ.$("#topic_type").html();
    var topic_description = templ.$("#topic_description").val();
    // console.log(topic_name);
    // console.log(topic_description);
    //We create the relevant new topic in the database
    var topic_id = Topics.insert({user_id: Meteor.userId(), name: topic_name, description:topic_description, type:topic_type, score: 0});
    Meteor.user().addToMyTopics(topic_id);
    Router.go('/topics/'+topic_id);
  },
  'submit form.form-search': function(e,templ){
    e.preventDefault();
      //We stop the event from propagating
    e.preventDefault();
    //We take the value from the inputs
    var topic_name = templ.$("#topic_name").val();
    var topic_type = templ.$("#topic_type").html();
    var topic_description = templ.$("#topic_description").val();
    // console.log(topic_name);
    // console.log(topic_description);
    //We create the relevant new topic in the database
    var topic_id = Topics.insert({user_id: Meteor.userId(), name: topic_name, description:topic_description, type:topic_type, score: 0});
    Meteor.user().addToMyTopics(topic_id);
    Router.go('/topics/'+topic_id);
  },
  'click #cancel_new_topic' : function() {
    Router.go('/');
  }
});

Template.topicCreationForm.events({
  // quand clic sur img private , la source change a la nouvelle image et l'autre grise
  // idem pour l'img group
  'click #private_icon' : function(e, templ) {
    var private_icon = templ.$("#private_icon");
    var public_icon = templ.$("#public_icon");
    var topic_type = templ.$("#topic_type");
    private_icon.addClass("enabled");
    private_icon.removeClass("disabled");
    public_icon.addClass("disabled");
    public_icon.removeClass("enabled");
    topic_type.html("private");
  },

  'click #public_icon' : function(e, templ) {
    var private_icon = templ.$("#private_icon");
    var public_icon = templ.$("#public_icon");
    var topic_type = templ.$("#topic_type");
    public_icon.addClass("enabled");
    public_icon.removeClass("disabled");
    private_icon.addClass("disabled");
    private_icon.removeClass("enabled");
    topic_type.html("public");
  }
});