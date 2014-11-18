if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    // var selectGraceHopper = function(){
    //   Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
    // };

    // var unselectPlayer = function(){
    //   Session.set("selected_player", null);
    //   Meteor.flush();
    // };

    describe("DailyGoal Model", function(){
      before(function(done){
        Meteor.autorun(function(){
          var user = Meteor.users.findOne({"profile.username":"m.coenca"});
          var dailyGoal = DailyGoals.findOne({user_id: user._id});
          if (dailyGoal){
            done();
          }
        });
      });

      it("should return the correct user", function(){
        Meteor.flush();
        chai.assert.deepEqual(dailyGoal.user(), user);
      });
    });
  });
}
