// Reference: https://github.com/janl/mustache.js/blob/master/mustache.js#L82

// YOUR CODE HERE:

var App = function(){
  this.escapeFilter = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  this.queryFilter = {
    limit: 10,
    order: "-updatedAt",
    where: '{"roomname": "default"}'
  };

  this.username = this.escapeHtml(window.location.search.slice(10));
  // this.currentRoom = ;

  // this.results

};

App.prototype.display = function(results){
  var that = this;
  results.forEach(function(msg){
    var room = that.escapeHtml(msg.roomname);
    var username = that.escapeHtml(msg.username);
    var text = that.escapeHtml(msg.text);
    var display = username + " : " + text + " @ " + room;
    var tag = '<p>' + display + '</p>';
    $('#main').append(tag);
  });
};

App.prototype.init = function(){
  var that = this;
  that.fetch(this.queryFilter, setLocalResult); //Why needs THAT?!
  // that.display(localResult);
};

App.prototype.send = function(message){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

App.prototype.fetch = function(filter, cb){
  var results;
  var that = this;
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: filter,
    contentType: 'application/json',

    success: function(data){
      cb(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: GET Failed');
    }
  });
  return results;
};


App.prototype.escapeHtml = function(string) {
  var that = this;
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return that.escapeFilter[s];
  });
};


var message = {
  'username': 'foobar',
  'text': 'foobar',
  'roomname': 'foobar'
};


var app = new App();
var localResult;

var setLocalResult = function(data){
  localResult = data.results;
  app.display(localResult);
};

app.init();

// setInterval(function, wait);


// console.log(localResult);
// app.fetch(app.queryFilter, setLocalResult);

// var localResult = app.fetch(app.queryFilter);
// console.log("Outside");



