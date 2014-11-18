//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Model, BaseModel;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/channikhabra:stupid-models/lib/base_model.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
BaseModel = function(){                                                                                            // 1
    this.errors = {};                                                                                              // 2
                                                                                                                   // 3
    this.collection = function(name) {                                                                             // 4
        throw Error("Not Implemented");                                                                            // 5
    };                                                                                                             // 6
    this.db = function() {                                                                                         // 7
        if(this._local) return this.collection()._collection;                                                      // 8
        else return this.collection();                                                                             // 9
    };                                                                                                             // 10
    this.persist = function() {                                                                                    // 11
        this.db().remove(this._id);                                                                                // 12
        delete this._local;                                                                                        // 13
        delete this._id;                                                                                           // 14
        this.save();                                                                                               // 15
    };                                                                                                             // 16
    this.store = function() {                                                                                      // 17
        this._local = true;                                                                                        // 18
        this.save();                                                                                               // 19
    };                                                                                                             // 20
    this.save = function() {                                                                                       // 21
        var attributes = this.getMongoAttributes();                                                                // 22
        return this._upsert(attributes);                                                                           // 23
    };                                                                                                             // 24
    this._upsert = function(attributes) {                                                                          // 25
        if(this._id) return this.update(attributes);                                                               // 26
        else return this.insert(attributes);                                                                       // 27
    };                                                                                                             // 28
    this.insert = function(attributes) {                                                                           // 29
        attributes = this.prepareDefaults(attributes);                                                             // 30
        this._id = this.db().insert(attributes);                                                                   // 31
        this.refresh();                                                                                            // 32
                                                                                                                   // 33
        return this._id;                                                                                           // 34
    };                                                                                                             // 35
    this.update = function(attributes) {                                                                           // 36
        this.db().update(this._id, {$set: attributes});                                                            // 37
        this.refresh();                                                                                            // 38
                                                                                                                   // 39
        return this._id;                                                                                           // 40
    };                                                                                                             // 41
    this.increment= function(attVal) {                                                                             // 42
        this.db().update(this._id, {$inc: attVal});                                                                // 43
        this.refresh();                                                                                            // 44
                                                                                                                   // 45
        return this._id;                                                                                           // 46
    };                                                                                                             // 47
    this.push = function(attVal) {                                                                                 // 48
        this.db().update(this._id, {$push: attVal});                                                               // 49
    };                                                                                                             // 50
    this.pop = function(att) {                                                                                     // 51
        this.db().update(this._id, {$pop: {att: 1}});                                                              // 52
    };                                                                                                             // 53
    this.shift = function(att) {                                                                                   // 54
        this.db().update(this._id, {$pop: {att: -1}});                                                             // 55
    };                                                                                                             // 56
    this.remove = function() {                                                                                     // 57
        this.db().remove(this._id);                                                                                // 58
    };                                                                                                             // 59
    this.refresh = function(){                                                                                     // 60
        this.extend(this.collection().findOne(this._id));                                                          // 61
    };                                                                                                             // 62
    this.prepareDefaults = function(attributes){                                                                   // 63
        var object = {};                                                                                           // 64
        _.extend(object, this.defaultValues, attributes);                                                          // 65
        return object;                                                                                             // 66
    };                                                                                                             // 67
    this.getMongoAttributes = function(includeId) {                                                                // 68
        var mongoValues = {};                                                                                      // 69
        for(var prop in this) {                                                                                    // 70
            if(this.isMongoAttribute(prop)) mongoValues[prop] = this[prop];                                        // 71
        }                                                                                                          // 72
                                                                                                                   // 73
        if(includeId) mongoValues._id = this._id;                                                                  // 74
                                                                                                                   // 75
        return mongoValues;                                                                                        // 76
    };                                                                                                             // 77
    this.isMongoAttribute = function(prop) {                                                                       // 78
        if(_.isFunction(this[prop])) return false;                                                                 // 79
        if(prop == '_id' || prop == 'errors' || prop == 'defaultValues' || prop == 'collectionName') return false; // 80
        return true;                                                                                               // 81
    };                                                                                                             // 82
    this.time = function(field) {                                                                                  // 83
        return moment(this[field]).format("MM/DD - h:mma");                                                        // 84
    };                                                                                                             // 85
    this.extend = function(doc) {                                                                                  // 86
        doc = doc != undefined && _.isObject(doc) ? doc : {};                                                      // 87
                                                                                                                   // 88
        _.extend(this, doc);                                                                                       // 89
    };                                                                                                             // 90
                                                                                                                   // 91
    this.delete = function(noAfterDelete) {                                                                        // 92
        console.log('deleting', this.collectionName);                                                              // 93
                                                                                                                   // 94
        this.db().remove(this._id);                                                                                // 95
        if(this.afterDelete && !noAfterDelete) this.afterDelete();                                                 // 96
    };                                                                                                             // 97
                                                                                                                   // 98
    return this;                                                                                                   // 99
};                                                                                                                 // 100
                                                                                                                   // 101
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/channikhabra:stupid-models/lib/model_factory.js                                                        //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
/**                                                                                                                // 1
 * Model factory which should be used for creating new models                                                      // 2
 */                                                                                                                // 3
Model = function(collection) {                                                                                     // 4
    var model = function StupidModel() {                                                                           // 5
        BaseModel.apply(this);                                                                                     // 6
        this.collection = function() {                                                                             // 7
            return collection;                                                                                     // 8
        };                                                                                                         // 9
                                                                                                                   // 10
        return this;                                                                                               // 11
    };                                                                                                             // 12
    model.extend = function(obj) {                                                                                 // 13
        _.extend(this.prototype, obj);                                                                             // 14
    };                                                                                                             // 15
                                                                                                                   // 16
    collection._transform = function(doc) {                                                                        // 17
        var stupidModel = new model(doc);                                                                          // 18
        _.extend(stupidModel, doc);                                                                                // 19
        return stupidModel;                                                                                        // 20
    };                                                                                                             // 21
                                                                                                                   // 22
    return  model;                                                                                                 // 23
};                                                                                                                 // 24
                                                                                                                   // 25
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['channikhabra:stupid-models'] = {
  Model: Model
};

})();
