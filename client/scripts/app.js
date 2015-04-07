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
    order: "-updatedAt"
    // notEqualTo: "username:ScreamBot"
  };
};


App.prototype.init = function(){
  var that = this;
  that.fetch(this.queryFilter); //Why needs THAT?!
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

App.prototype.fetch = function(filter){

  var that = this;
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: filter,
    contentType: 'application/json',

    success: function(data){
      console.log(data.results.length);
      console.log(data.results);
      var results = data.results;
      results.forEach(function(msg){
        var username = that.escapeHtml(msg.username);
        var text = that.escapeHtml(msg.text);
        var display = username + " : " + text;
        var tag = '<p>' + display + '</p>';
        $('#main').append(tag);
      });
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: GET Failed');
    }
  });
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

// app.init();

// app.fetch(app.queryFilter);



