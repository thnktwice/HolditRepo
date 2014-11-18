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
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var HTML = Package.htmljs.HTML;

/* Package-scope variables */
var Template;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// packages/templating/templating.js                                                                            //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
                                                                                                                // 1
// Packages and apps add templates on to this object.                                                           // 2
                                                                                                                // 3
/**                                                                                                             // 4
 * @summary The class for defining templates                                                                    // 5
 * @class                                                                                                       // 6
 * @instanceName Template.myTemplate                                                                            // 7
 */                                                                                                             // 8
Template = Blaze.Template;                                                                                      // 9
                                                                                                                // 10
// Check for duplicate template names and illegal names that won't work.                                        // 11
Template.__checkName = function (name) {                                                                        // 12
  if (name in Template) {                                                                                       // 13
    if ((Template[name] instanceof Template) && name !== "body")                                                // 14
      throw new Error("There are multiple templates named '" + name + "'. Each template needs a unique name."); // 15
    throw new Error("This template name is reserved: " + name);                                                 // 16
  }                                                                                                             // 17
};                                                                                                              // 18
                                                                                                                // 19
// XXX COMPAT WITH 0.8.3                                                                                        // 20
Template.__define__ = function (name, renderFunc) {                                                             // 21
  Template.__checkName(name);                                                                                   // 22
  Template[name] = new Template("Template." + name, renderFunc);                                                // 23
  // Exempt packages built pre-0.9.0 from warnings about using old                                              // 24
  // helper syntax, because we can.  It's not very useful to get a                                              // 25
  // warning about someone else's code (like a package on Atmosphere),                                          // 26
  // and this should at least put a bit of a dent in number of warnings                                         // 27
  // that come from packages that haven't been updated lately.                                                  // 28
  Template[name]._NOWARN_OLDSTYLE_HELPERS = true;                                                               // 29
};                                                                                                              // 30
                                                                                                                // 31
// Define a template `Template.body` that renders its                                                           // 32
// `contentViews`.  `<body>` tags (of which there may be                                                        // 33
// multiple) will have their contents added to it.                                                              // 34
                                                                                                                // 35
/**                                                                                                             // 36
 * @summary The [template object](#templates_api) representing your `<body>` tag.                               // 37
 * @locus Client                                                                                                // 38
 */                                                                                                             // 39
Template.body = new Template('body', function () {                                                              // 40
  var parts = Template.body.contentViews;                                                                       // 41
  // enable lookup by setting `view.template`                                                                   // 42
  for (var i = 0; i < parts.length; i++)                                                                        // 43
    parts[i].template = Template.body;                                                                          // 44
  return parts;                                                                                                 // 45
});                                                                                                             // 46
Template.body.contentViews = []; // array of Blaze.Views                                                        // 47
Template.body.view = null;                                                                                      // 48
                                                                                                                // 49
Template.body.addContent = function (renderFunc) {                                                              // 50
  var kind = 'body_content_' + Template.body.contentViews.length;                                               // 51
                                                                                                                // 52
  Template.body.contentViews.push(Blaze.View(kind, renderFunc));                                                // 53
};                                                                                                              // 54
                                                                                                                // 55
// This function does not use `this` and so it may be called                                                    // 56
// as `Meteor.startup(Template.body.renderIntoDocument)`.                                                       // 57
Template.body.renderToDocument = function () {                                                                  // 58
  // Only do it once.                                                                                           // 59
  if (Template.body.view)                                                                                       // 60
    return;                                                                                                     // 61
                                                                                                                // 62
  var view = Blaze.render(Template.body, document.body);                                                        // 63
  Template.body.view = view;                                                                                    // 64
};                                                                                                              // 65
                                                                                                                // 66
// XXX COMPAT WITH 0.9.0                                                                                        // 67
UI.body = Template.body;                                                                                        // 68
                                                                                                                // 69
// XXX COMPAT WITH 0.9.0                                                                                        // 70
// (<body> tags in packages built with 0.9.0)                                                                   // 71
Template.__body__ = Template.body;                                                                              // 72
Template.__body__.__contentParts = Template.body.contentViews;                                                  // 73
Template.__body__.__instantiate = Template.body.renderToDocument;                                               // 74
                                                                                                                // 75
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.templating = {
  Template: Template
};

})();
