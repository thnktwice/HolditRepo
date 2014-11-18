var Schemas = {};

//The schema for users is a next step because it is managed through
//Meteor.users and not really stable depending on the login options
Schemas.Log = new SimpleSchema({
    topic_id: {
        type: String,
        label: "Topic"
    },
    user_id: {
        type: String,
        label: "User"
    },
    timestamp: {
        type: Number,
        label: "Timestamp"
    },
    type: {
        type: String,
        label: "Log type : count, message, adminMessage, adminImage ",
    },
    content: {
        type: String,
        label: "Content of the message",
        optional: true,
        max: 1000
    }
});

Schemas.Topic = new SimpleSchema({
    user_id: {
        type: String,
        label: "User"
    },
    name: {
        type: String,
        label: "topic Name"
    },
    type: {
        type: String,
        label:"Topic type : private or public"
    },
    description: {
        type: String,
        label: "Topic Description",
        optional: true,
        max: 1000
    },
    score: {
        type: Number,
        label: "Number of counts in the topic",
        min: 0,
        optional: true
    }
});

Schemas.MyTopic = new SimpleSchema({
    user_id: {
        type: String,
        label: "User"
    },
    topic_id: {
        type: String,
        label: "Topic"
    },
});

Schemas.DailyGoal = new SimpleSchema({
    user_id: {
        type: String,
        label: "User"
    },
    topic_id: {
        type: String,
        label: "Topic"
    },
    comparator: {
        type: String,
        label:"Goal comparator : moreThan or lessThan"
    },
    value: {
        type: Number,
        label: "Goal value",
        min: 0,
        optional: true
    },    
    timestamp: {
        type: Number,
        label: "Timestamp"
    },
});

MyTopics.attachSchema(Schemas.MyTopic);
Logs.attachSchema(Schemas.Log);
Topics.attachSchema(Schemas.Topic);
DailyGoals.attachSchema(Schemas.DailyGoal);

