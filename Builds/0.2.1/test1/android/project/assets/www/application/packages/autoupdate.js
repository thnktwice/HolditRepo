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
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Retry = Package.retry.Retry;
var DDP = Package.ddp.DDP;
var Mongo = Package.mongo.Mongo;
var _ = Package.underscore._;
var HTTP = Package.http.HTTP;

/* Package-scope variables */
var Autoupdate, ClientVersions;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                 //
// packages/autoupdate/autoupdate_cordova.js                                                       //
//                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                   //
var DEBUG_TAG = 'METEOR CORDOVA DEBUG (autoupdate_cordova.js) ';                                   // 1
var log = function (msg) {                                                                         // 2
  console.log(DEBUG_TAG + msg);                                                                    // 3
};                                                                                                 // 4
                                                                                                   // 5
// This constant was picked by testing on iOS 7.1                                                  // 6
// We limit the number of concurrent downloads because iOS gets angry on the                       // 7
// application when a certain limit is exceeded and starts timing-out the                          // 8
// connections in 1-2 minutes which makes the whole HCP really slow.                               // 9
var MAX_NUM_CONCURRENT_DOWNLOADS = 30;                                                             // 10
var MAX_RETRY_COUNT = 5;                                                                           // 11
                                                                                                   // 12
var autoupdateVersionCordova = __meteor_runtime_config__.autoupdateVersionCordova || "unknown";    // 13
                                                                                                   // 14
// The collection of acceptable client versions.                                                   // 15
ClientVersions = new Meteor.Collection("meteor_autoupdate_clientVersions");                        // 16
                                                                                                   // 17
Autoupdate = {};                                                                                   // 18
                                                                                                   // 19
Autoupdate.newClientAvailable = function () {                                                      // 20
  return !! ClientVersions.findOne({                                                               // 21
    _id: 'version-cordova',                                                                        // 22
    version: {$ne: autoupdateVersionCordova}                                                       // 23
  });                                                                                              // 24
};                                                                                                 // 25
                                                                                                   // 26
var writeFile = function (directoryPath, fileName, content, cb) {                                  // 27
  var fail = function (err) {                                                                      // 28
    cb(new Error("Failed to write file: ", err), null);                                            // 29
  };                                                                                               // 30
                                                                                                   // 31
  window.resolveLocalFileSystemURL(directoryPath, function (dirEntry) {                            // 32
    var success = function (fileEntry) {                                                           // 33
      fileEntry.createWriter(function (writer) {                                                   // 34
        writer.onwrite = function (evt) {                                                          // 35
          var result = evt.target.result;                                                          // 36
          cb(null, result);                                                                        // 37
        };                                                                                         // 38
        writer.onerror = fail;                                                                     // 39
        writer.write(content);                                                                     // 40
      }, fail);                                                                                    // 41
    };                                                                                             // 42
                                                                                                   // 43
    dirEntry.getFile(fileName, {                                                                   // 44
      create: true,                                                                                // 45
      exclusive: false                                                                             // 46
    }, success, fail);                                                                             // 47
  }, fail);                                                                                        // 48
};                                                                                                 // 49
                                                                                                   // 50
var restartServer = function (location) {                                                          // 51
  log('restartServer with location ' + location);                                                  // 52
  var fail = function (err) { log("Unexpected error in restartServer: " + err.message) };          // 53
  var httpd = cordova && cordova.plugins && cordova.plugins.CordovaUpdate;                         // 54
                                                                                                   // 55
  if (! httpd) {                                                                                   // 56
    fail(new Error('no httpd'));                                                                   // 57
    return;                                                                                        // 58
  }                                                                                                // 59
                                                                                                   // 60
  var startServer = function (cordovajsRoot) {                                                     // 61
    httpd.startServer({                                                                            // 62
      'www_root' : location,                                                                       // 63
      'cordovajs_root': cordovajsRoot                                                              // 64
    }, function (url) {                                                                            // 65
      Package.reload.Reload._reload();                                                             // 66
    }, fail);                                                                                      // 67
  };                                                                                               // 68
                                                                                                   // 69
  httpd.getCordovajsRoot(function (cordovajsRoot) {                                                // 70
    startServer(cordovajsRoot);                                                                    // 71
  }, fail);                                                                                        // 72
};                                                                                                 // 73
                                                                                                   // 74
var hasCalledReload = false;                                                                       // 75
var updating = false;                                                                              // 76
var localPathPrefix = null;                                                                        // 77
                                                                                                   // 78
var onNewVersion = function () {                                                                   // 79
  var ft = new FileTransfer();                                                                     // 80
  var urlPrefix = Meteor.absoluteUrl() + '__cordova';                                              // 81
  HTTP.get(urlPrefix + '/manifest.json', function (err, res) {                                     // 82
    if (err || ! res.data) {                                                                       // 83
      log('Failed to download the manifest ' + (err && err.message) + ' ' + (res && res.content)); // 84
      return;                                                                                      // 85
    }                                                                                              // 86
                                                                                                   // 87
    updating = true;                                                                               // 88
    ensureLocalPathPrefix();                                                                       // 89
                                                                                                   // 90
    var program = res.data;                                                                        // 91
    var manifest = _.clone(program.manifest);                                                      // 92
    var version = program.version;                                                                 // 93
    var ft = new FileTransfer();                                                                   // 94
                                                                                                   // 95
    manifest.push({ url: '/index.html?' + Random.id() });                                          // 96
                                                                                                   // 97
    var versionPrefix = localPathPrefix + version;                                                 // 98
                                                                                                   // 99
    var queue = [];                                                                                // 100
    _.each(manifest, function (item) {                                                             // 101
      if (! item.url) return;                                                                      // 102
                                                                                                   // 103
      var url = item.url;                                                                          // 104
      url = url.replace(/\?.+$/, '');                                                              // 105
                                                                                                   // 106
      queue.push(url);                                                                             // 107
    });                                                                                            // 108
                                                                                                   // 109
    var afterAllFilesDownloaded = _.after(queue.length, function () {                              // 110
      var wroteManifest = function (err) {                                                         // 111
        if (err) {                                                                                 // 112
          log("Failed to write manifest.json: " + err);                                            // 113
          // XXX do something smarter?                                                             // 114
          return;                                                                                  // 115
        }                                                                                          // 116
                                                                                                   // 117
        // success! downloaded all sources and saved the manifest                                  // 118
        // save the version string for atomicity                                                   // 119
        writeFile(localPathPrefix, 'version', version, function (err) {                            // 120
          if (err) {                                                                               // 121
            log("Failed to write version: " + err);                                                // 122
            return;                                                                                // 123
          }                                                                                        // 124
                                                                                                   // 125
          // don't call reload twice!                                                              // 126
          if (! hasCalledReload) {                                                                 // 127
            var location = uriToPath(localPathPrefix + version);                                   // 128
            restartServer(location);                                                               // 129
          }                                                                                        // 130
        });                                                                                        // 131
      };                                                                                           // 132
                                                                                                   // 133
      writeFile(versionPrefix, 'manifest.json',                                                    // 134
                JSON.stringify(program, undefined, 2), wroteManifest);                             // 135
    });                                                                                            // 136
                                                                                                   // 137
    var dowloadUrl = function (url) {                                                              // 138
      console.log(DEBUG_TAG + "start dowloading " + url);                                          // 139
      // Add a cache buster to ensure that we don't cache an old asset.                            // 140
      var uri = encodeURI(urlPrefix + url + '?' + Random.id());                                    // 141
                                                                                                   // 142
      // Try to dowload the file a few times.                                                      // 143
      var tries = 0;                                                                               // 144
      var tryDownload = function () {                                                              // 145
        ft.download(uri, versionPrefix + encodeURI(url), function (entry) {                        // 146
          if (entry) {                                                                             // 147
            console.log(DEBUG_TAG + "done dowloading " + url);                                     // 148
            // start downloading next queued url                                                   // 149
            if (queue.length)                                                                      // 150
              dowloadUrl(queue.shift());                                                           // 151
            afterAllFilesDownloaded();                                                             // 152
          }                                                                                        // 153
        }, function (err) {                                                                        // 154
          // It failed, try again if we have tried less than 5 times.                              // 155
          if (tries++ < MAX_RETRY_COUNT) {                                                         // 156
            log("Download error, will retry (#" + tries + "): " + uri);                            // 157
            tryDownload();                                                                         // 158
          } else {                                                                                 // 159
            log('Download failed: ' + err + ", source=" + err.source + ", target=" + err.target);  // 160
          }                                                                                        // 161
        });                                                                                        // 162
      };                                                                                           // 163
                                                                                                   // 164
      tryDownload();                                                                               // 165
    };                                                                                             // 166
                                                                                                   // 167
    _.times(Math.min(MAX_NUM_CONCURRENT_DOWNLOADS, queue.length), function () {                    // 168
      var nextUrl = queue.shift();                                                                 // 169
      // XXX defer the next download so iOS doesn't rate limit us on concurrent                    // 170
      // downloads                                                                                 // 171
      Meteor.setTimeout(dowloadUrl.bind(null, nextUrl), 50);                                       // 172
    });                                                                                            // 173
  });                                                                                              // 174
};                                                                                                 // 175
                                                                                                   // 176
var retry = new Retry({                                                                            // 177
  minCount: 0, // don't do any immediate retries                                                   // 178
  baseTimeout: 30*1000 // start with 30s                                                           // 179
});                                                                                                // 180
var failures = 0;                                                                                  // 181
                                                                                                   // 182
Autoupdate._retrySubscription = function () {                                                      // 183
  var appId = __meteor_runtime_config__.appId;                                                     // 184
  Meteor.subscribe("meteor_autoupdate_clientVersions", appId, {                                    // 185
    onError: function (err) {                                                                      // 186
      Meteor._debug("autoupdate subscription failed:", err);                                       // 187
      failures++;                                                                                  // 188
      retry.retryLater(failures, function () {                                                     // 189
        // Just retry making the subscription, don't reload the whole                              // 190
        // page. While reloading would catch more cases (for example,                              // 191
        // the server went back a version and is now doing old-style hot                           // 192
        // code push), it would also be more prone to reload loops,                                // 193
        // which look really bad to the user. Just retrying the                                    // 194
        // subscription over DDP means it is at least possible to fix by                           // 195
        // updating the server.                                                                    // 196
        Autoupdate._retrySubscription();                                                           // 197
      });                                                                                          // 198
    }                                                                                              // 199
  });                                                                                              // 200
  if (Package.reload) {                                                                            // 201
    var checkNewVersionDocument = function (doc) {                                                 // 202
      var self = this;                                                                             // 203
      if (doc.version !== autoupdateVersionCordova) {                                              // 204
        onNewVersion();                                                                            // 205
      }                                                                                            // 206
    };                                                                                             // 207
                                                                                                   // 208
    var handle = ClientVersions.find({                                                             // 209
      _id: 'version-cordova'                                                                       // 210
    }).observe({                                                                                   // 211
      added: checkNewVersionDocument,                                                              // 212
      changed: checkNewVersionDocument                                                             // 213
    });                                                                                            // 214
  }                                                                                                // 215
};                                                                                                 // 216
                                                                                                   // 217
Meteor.startup(function () {                                                                       // 218
  clearAutoupdateCache(autoupdateVersionCordova);                                                  // 219
});                                                                                                // 220
Meteor.startup(Autoupdate._retrySubscription);                                                     // 221
                                                                                                   // 222
                                                                                                   // 223
// A helper that removes old directories left from previous autoupdates                            // 224
var clearAutoupdateCache = function (currentVersion) {                                             // 225
  ensureLocalPathPrefix();                                                                         // 226
  // Try to clean up our cache directory, make sure to scan the directory                          // 227
  // *before* loading the actual app. This ordering will prevent race                              // 228
  // conditions when the app code tries to download a new version before                           // 229
  // the old-cache removal has scanned the cache folder.                                           // 230
  listDirectory(localPathPrefix, {dirsOnly: true}, function (err, names) {                         // 231
    // Couldn't get the list of dirs or risking to get into a race with an                         // 232
    // on-going update to disk.                                                                    // 233
    if (err || updating) {                                                                         // 234
      return;                                                                                      // 235
    }                                                                                              // 236
                                                                                                   // 237
    _.each(names, function (name) {                                                                // 238
      // Skip the folder with the latest version                                                   // 239
      if (name === currentVersion)                                                                 // 240
        return;                                                                                    // 241
                                                                                                   // 242
      // remove everything else, as we don't want to keep too much cache                           // 243
      // around on disk                                                                            // 244
      removeDirectory(localPathPrefix + name + '/', function (err) {                               // 245
        if (err) {                                                                                 // 246
          log('Failed to remove an old cache folder '                                              // 247
              + name + ':' + err.message);                                                         // 248
        } else {                                                                                   // 249
          log('Successfully removed an old cache folder ' + name);                                 // 250
        }                                                                                          // 251
      });                                                                                          // 252
    });                                                                                            // 253
  });                                                                                              // 254
};                                                                                                 // 255
                                                                                                   // 256
// Cordova File plugin helpers                                                                     // 257
var listDirectory = function (url, options, cb) {                                                  // 258
  if (typeof options === 'function')                                                               // 259
    cb = options, options = {};                                                                    // 260
                                                                                                   // 261
  var fail = function (err) { cb(err); };                                                          // 262
  window.resolveLocalFileSystemURL(url, function (entry) {                                         // 263
    var reader = entry.createReader();                                                             // 264
    reader.readEntries(function (entries) {                                                        // 265
      var names = [];                                                                              // 266
      _.each(entries, function (entry) {                                                           // 267
        if (! options.dirsOnly || entry.isDirectory)                                               // 268
          names.push(entry.name);                                                                  // 269
      });                                                                                          // 270
      cb(null, names);                                                                             // 271
    }, fail);                                                                                      // 272
  }, fail);                                                                                        // 273
};                                                                                                 // 274
                                                                                                   // 275
var removeDirectory = function (url, cb) {                                                         // 276
  var fail = function (err) {                                                                      // 277
    cb(err);                                                                                       // 278
  };                                                                                               // 279
  window.resolveLocalFileSystemURL(url, function (entry) {                                         // 280
    entry.removeRecursively(function () { cb(); }, fail);                                          // 281
  }, fail);                                                                                        // 282
};                                                                                                 // 283
                                                                                                   // 284
var uriToPath = function (uri) {                                                                   // 285
  return decodeURI(uri).replace(/^file:\/\//g, '');                                                // 286
};                                                                                                 // 287
                                                                                                   // 288
var ensureLocalPathPrefix = function () {                                                          // 289
  localPathPrefix = localPathPrefix || cordova.file.dataDirectory + 'meteor/';                     // 290
};                                                                                                 // 291
                                                                                                   // 292
                                                                                                   // 293
/////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.autoupdate = {
  Autoupdate: Autoupdate
};

})();
