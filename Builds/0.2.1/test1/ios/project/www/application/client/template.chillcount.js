(function(){
Template.body.addContent((function() {
  var view = this;
  return "";
}));
Meteor.startup(Template.body.renderToDocument);

Template.__checkName("layout");
Template["layout"] = new Template("Template.layout", (function() {
  var view = this;
  return [ Spacebars.include(view.lookupTemplate("yield")), HTML.Raw("\n<br><br><br><br><br><br><br><br><br><br><br><br>\n"), HTML.P("\n  ", HTML.I("\n    ", HTML.DIV({
    id: "bluetooth_status"
  }, "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("logmessage"));
  }), "\n    "), "\n    ", Blaze.If(function() {
    return Spacebars.call(view.lookup("beanWasDisconnected"));
  }, function() {
    return [ "\n    ", HTML.DIV({
      id: "bluetooth_reconnect"
    }, "\n    ", HTML.A("Reconnect to the ChillButton >>"), "\n    "), "\n    " ];
  }), "\n  "), "\n") ];
}));

Template.__checkName("login");
Template["login"] = new Template("Template.login", (function() {
  var view = this;
  return [ HTML.Raw("<p><i>Ready,steady....</i></p>\n  "), HTML.DIV({
    id: "login"
  }, "\n    ", Spacebars.include(view.lookupTemplate("loginButtons")), "\n  "), "\n  ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUser"));
  }, function() {
    return [ "\n    ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("goHome"));
    }), "\n  " ];
  }) ];
}));

Template.__checkName("topics_board");
Template["topics_board"] = new Template("Template.topics_board", (function() {
  var view = this;
  return [ HTML.Raw('<!-- navigation bar -->\n  <div class="navbar navbar-fixed-top">\n      <div class="navbar-inner">\n        <div class="container">\n          <div class="row">\n            <div class="col-xs-2 left_button" id="add_topic">\n            </div>\n            <div class="col-xs-8 title_box">\n                <h2 class="title">Chillcount</h2>\n            </div> \n            <div class="col-xs-2 right_button">\n            </div>\n          </div>\n        </div>\n      </div>\n    </div>\n\n  '), HTML.DIV({
    "class": "topicBoard"
  }, "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("debug"));
  }), "\n    ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("loggedInSoRegisterForNotif"));
  }), "\n    ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("topics"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("topic")), "\n    " ];
  }), "\n    \n      ", HTML.Raw('<!-- <input type="text" class="span2 search-query"/> -->'), "\n    ", HTML.DIV({
    id: "footer"
  }, "  \n      ", HTML.Raw("<hr>"), "\n      ", HTML.Raw("<p><i>Thanks for joining Superchill !</i></p>"), "\n      ", Spacebars.include(view.lookupTemplate("loginButtons")), "\n      ", HTML.Raw("<br>"), HTML.Raw("<br>"), "\n    "), "\n  ") ];
}));

Template.__checkName("topic");
Template["topic"] = new Template("Template.topic", (function() {
  var view = this;
  return HTML.DIV({
    "class": function() {
      return [ "topic ", Spacebars.mustache(view.lookup("selected")) ];
    }
  }, "\n  ", Blaze.If(function() {
    return Spacebars.call(view.lookup("currentUserIsAdmin"));
  }, function() {
    return [ "\n    ", HTML.DIV({
      "class": "creator"
    }, "\n      ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "uname"));
    }), "\n    "), "\n  " ];
  }), "\n    ", HTML.DIV({
    "class": "container"
  }, "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", HTML.DIV({
    "class": "col-xs-3 plus score"
  }, "\n          ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("score"));
  }), "\n        "), "\n        ", HTML.DIV({
    "class": "col-xs-7 name"
  }, "\n          ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  }), "\n          ", HTML.DIV({
    "class": "row"
  }, "\n            ", HTML.DIV({
    "class": function() {
      return [ "col-xs-3 ", Spacebars.mustache(view.lookup("type")), "_small_icon" ];
    }
  }, "\n            "), "\n            ", HTML.DIV({
    "class": "col-xs-2"
  }, "\n              ", Blaze.If(function() {
    return Spacebars.call(view.lookup("beanIsConnected"));
  }, function() {
    return [ "\n              ", HTML.DIV({
      "class": function() {
        return [ "link_icon ", Spacebars.mustache(view.lookup("selected")) ];
      }
    }, "\n              "), "\n              " ];
  }), "\n            "), "\n          "), "\n        "), "\n        ", HTML.Raw('<div class="col-xs-1">\n          <div class="go">\n          </div>\n        </div>'), "\n      "), "\n    "), "\n  ");
}));

Template.__checkName("topic_creation");
Template["topic_creation"] = new Template("Template.topic_creation", (function() {
  var view = this;
  return [ HTML.Raw('<div class="navbar navbar-fixed-top">\n    <div class="navbar-inner">\n      <div class="container">\n        <div class="row">\n          <div class="col-xs-2 left_button" id="cancel_new_topic">\n          </div>\n          <div class="col-xs-8 title_box">\n            <h2 class="title">New Topic</h2>\n          </div>\n          <div class="col-xs-2 right_button" id="new_topic">\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  '), HTML.DIV({
    id: "topic_creation_form"
  }, "\n   ", Spacebars.include(view.lookupTemplate("topic_creation_form")), "\n  ") ];
}));

Template.__checkName("topic_creation_form");
Template["topic_creation_form"] = new Template("Template.topic_creation_form", (function() {
  var view = this;
  return HTML.FORM({
    "class": "form-search"
  }, "\n    ", HTML.DIV({
    "class": "container"
  }, "\n      ", HTML.Raw('<div class="row">\n        <br>\n        <div class="col-xs-12">\n          <input class="form-control" type="text" id="topic_name" placeholder="Title (max 14 char)" maxlength="14">\n        </div>\n      </div>'), "\n      ", HTML.Raw("<br>"), "\n      ", HTML.DIV({
    "class": "row"
  }, "\n        ", HTML.DIV({
    "class": "col-xs-12"
  }, "\n          ", HTML.TEXTAREA({
    rows: "3",
    placeholder: "Description",
    id: "topic_description",
    "class": "form-control"
  }), "\n        "), "\n      "), "\n      ", HTML.Raw("<br>"), "\n      ", HTML.Raw("<br>"), "\n      ", HTML.Raw('<div class="row">\n        <div class="col-xs-12">\n          <label class="control-label" id="shared_with">Shared with: </label>\n          <br>\n        </div>\n      </div>'), "\n      ", HTML.Raw("<br>"), "\n      ", HTML.Raw('<div class="row">\n        <div class="col-xs-6 enabled" id="private_icon">\n        </div>\n        <div class="col-xs-6 disabled" id="public_icon">\n        </div>\n      </div>'), "\n    "), HTML.Raw('\n    <!-- champ cache html style display:none, son id icon_type, .html , div -->\n    <div id="topic_type" style="display:none">private</div>\n  '));
}));

Template.__checkName("topic_timeline");
Template["topic_timeline"] = new Template("Template.topic_timeline", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "navbar navbar-fixed-top"
  }, "\n    ", HTML.DIV({
    "class": "navbar-inner"
  }, "\n      ", HTML.DIV({
    "class": "container"
  }, "\n        ", HTML.DIV({
    "class": "row"
  }, "\n          ", HTML.Raw('<div class="col-xs-2 left_button" id="back">\n          </div>'), "\n          ", HTML.DIV({
    "class": "col-xs-8 title_box"
  }, "\n            ", HTML.H2({
    "class": "title"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("name"));
  })), "\n          "), "\n          ", HTML.Raw('<div class="col-xs-2 right_button">\n          </div>'), "\n        "), "\n      "), "\n    "), "\n  "), "\n\n  ", HTML.DIV({
    "class": "container",
    id: "scoreboard"
  }, "\n\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-xs-3"
  }, "\n        ", HTML.P({
    id: "my_score"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("my_score"));
  })), "\n      "), "\n      ", HTML.DIV({
    "class": "col-xs-6 plus"
  }, "\n        ", HTML.H1({
    id: "total_score"
  }, Blaze.View(function() {
    return Spacebars.mustache(view.lookup("score"));
  })), "\n      "), "\n      ", HTML.DIV({
    "class": "col-xs-3"
  }, "\n        ", HTML.DIV({
    "class": function() {
      return [ "link_icon_", Spacebars.mustache(view.lookup("selected")) ];
    }
  }), "\n      "), "\n    "), "\n\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-xs-12"
  }, "\n        ", HTML.H4({
    id: "description"
  }, HTML.I(Blaze.View(function() {
    return Spacebars.mustache(view.lookup("description"));
  }))), "\n      "), "\n    "), "\n    ", HTML.Raw('<div class="row">\n      <hr>\n    </div>'), "\n  \n\n    ", HTML.Raw('<form class="form-search">\n      <div class="row">\n        <div class="col-xs-12">\n        <form>\n          <div class="input-group">\n            <input type="text" class="form-control" id="message_content" placeholder="Feelings about these logs ?">\n            <span class="input-group-btn">\n              <button class="btn btn-warning" type="button" id="new_message">Post</button>\n            </span>\n          </div>\n          </form>\n        </div>\n      </div>\n    </form>'), "\n\n    ", HTML.Raw("<br>"), "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-xs-12"
  }, "\n        ", Blaze.Each(function() {
    return Spacebars.call(view.lookup("logs"));
  }, function() {
    return [ "\n          ", Spacebars.include(view.lookupTemplate("log")), "\n        " ];
  }), "\n      "), "\n    "), "\n  "), HTML.Raw("\n  <br>") ];
}));

Template.__checkName("log");
Template["log"] = new Template("Template.log", (function() {
  var view = this;
  return HTML.DIV({
    "class": "log"
  }, "\n    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("."), "isMessage"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("message")), "\n    " ];
  }), "\n    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("."), "isCount"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("count")), "\n    " ];
  }), "    \n    ", Blaze.If(function() {
    return Spacebars.call(Spacebars.dot(view.lookup("."), "isAdminMessage"));
  }, function() {
    return [ "\n      ", Spacebars.include(view.lookupTemplate("adminMessage")), "\n    " ];
  }), "\n  ");
}));

Template.__checkName("count");
Template["count"] = new Template("Template.count", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isMine"));
  }, function() {
    return [ "\n  ", HTML.DIV({
      "class": "count mine"
    }, "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12 formatted_time mine"
    }, "\n        ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("formatted_time"), view.lookup("timestamp"));
    }), "\n      "), "\n    "), "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12 mine"
    }, "\n        ", HTML.SPAN({
      "class": "score_log"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("score"));
    })), "\n        ", HTML.SPAN({
      "class": "name_log"
    }, HTML.CharRef({
      html: "&nbsp;",
      str: " "
    }), "by me"), "\n      "), "\n    "), "\n  "), "\n  " ];
  }, function() {
    return [ "\n  ", HTML.DIV({
      "class": "count"
    }, "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12 formatted_time"
    }, "\n        ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("formatted_time"), view.lookup("timestamp"));
    }), "\n      "), "\n    "), "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12"
    }, "\n        ", HTML.SPAN({
      "class": "name_log"
    }, Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "uname"));
    }), ":", HTML.CharRef({
      html: "&nbsp;",
      str: " "
    })), "\n        ", HTML.SPAN({
      "class": "score_log"
    }, Blaze.View(function() {
      return Spacebars.mustache(view.lookup("score"));
    })), "\n      "), "\n    "), "\n  "), "\n  " ];
  });
}));

Template.__checkName("message");
Template["message"] = new Template("Template.message", (function() {
  var view = this;
  return Blaze.If(function() {
    return Spacebars.call(view.lookup("isMine"));
  }, function() {
    return [ "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12 formatted_time mine"
    }, "\n        ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("formatted_time"), view.lookup("timestamp"));
    }), "\n      "), "\n    "), "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-11 col-xs-offset-1"
    }, "\n        ", HTML.DIV({
      "class": "message"
    }, "\n          ", HTML.DIV({
      "class": "row"
    }, " \n            ", HTML.DIV({
      "class": "col-xs-12 uname mine"
    }, "\n              (", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("score"));
    }), ")  Me\n            "), "\n          "), "\n          ", HTML.DIV({
      "class": "row"
    }, "\n            ", HTML.DIV({
      "class": "col-xs-12 content mine"
    }, "\n              ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    }), "\n            "), "\n          "), "\n        "), "\n      "), "\n    "), "\n  " ];
  }, function() {
    return [ "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-12 formatted_time"
    }, "\n        ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("formatted_time"), view.lookup("timestamp"));
    }), "\n      "), "\n    "), "\n    ", HTML.DIV({
      "class": "row"
    }, " \n      ", HTML.DIV({
      "class": "col-xs-11"
    }, "\n        ", HTML.DIV({
      "class": "message"
    }, "\n          ", HTML.DIV({
      "class": "row"
    }, " \n            ", HTML.DIV({
      "class": "col-xs-12 uname"
    }, "\n              ", Blaze.View(function() {
      return Spacebars.mustache(Spacebars.dot(view.lookup("."), "uname"));
    }), "  (", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("score"));
    }), ")\n            "), "\n          "), "\n          ", HTML.DIV({
      "class": "row"
    }, "\n            ", HTML.DIV({
      "class": "col-xs-12 content"
    }, "\n              ", Blaze.View(function() {
      return Spacebars.mustache(view.lookup("content"));
    }), "\n            "), "\n          "), "\n        "), "\n      "), "\n    "), "\n  " ];
  });
}));

Template.__checkName("adminMessage");
Template["adminMessage"] = new Template("Template.adminMessage", (function() {
  var view = this;
  return [ HTML.DIV({
    "class": "row"
  }, " \n    ", HTML.DIV({
    "class": "col-xs-12 admin_formatted_time"
  }, "\n      ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("formatted_time"), view.lookup("timestamp"));
  }), "\n    "), "\n  "), "\n  ", HTML.DIV({
    "class": "row"
  }, " \n    ", HTML.DIV({
    "class": "col-xs-11"
  }, "\n      ", HTML.DIV({
    "class": "adminMessage"
  }, "\n        ", HTML.Raw('<div class="row"> \n          <div class="col-xs-12 admin_uname">\n            <span>Chillbot</span>\n            <span class="chillbot"></span>\n          </div>\n        </div>'), "\n        ", HTML.DIV({
    "class": "row"
  }, "\n          ", HTML.DIV({
    "class": "col-xs-12 admin_content"
  }, "\n          ", Blaze.View(function() {
    return Spacebars.mustache(view.lookup("content"));
  }), "\n          "), "\n        "), "\n      "), "\n    "), "\n  ") ];
}));

Template.__checkName("page_not_found");
Template["page_not_found"] = new Template("Template.page_not_found", (function() {
  var view = this;
  return HTML.Raw("<h1>Something went wrong....</h1>");
}));

})();
