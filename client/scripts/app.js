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
    limit: 100,
    order: "-updatedAt",
    // where: '{"roomname": "default"}'
  };

  this.roomFilter = {
    limit: 500,
    order: '-updatedAt'
  };

  this.username = this.escapeHtml(window.location.search.slice(10));
  this.currentRoom = 'default';

  // this.results

};

App.prototype.display = function(results){
  var that = this;
  // Empty chat div
  $('#chat').html('');

  results.forEach(function(msg){
    var room = that.escapeHtml(msg.roomname);
    var username = that.escapeHtml(msg.username);
    var text = that.escapeHtml(msg.text);
    var display = username + " : " + text + " @ " + room;
    var tag = '<p>' + display + '</p>';
    $('#chat').append(tag);
  });
};

App.prototype.init = function(){
  var that = this;
  that.fetch(that.queryFilter, setLocalResult); //Why needs THAT?!
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

App.prototype.generateRoomnames = function(){
  var that = this;
  that.fetch(that.roomFilter, populateRooms);
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

// Populate rooms
//
//
var existingRooms = {};

var populateRooms = function(data){
  data.results.forEach(function(msg){
    var roomname = app.escapeHtml(msg.roomname);
    if (!existingRooms.hasOwnProperty(roomname)){
      existingRooms[roomname] = roomname;
    }
  });

  $('#roomnameList').html('');

  for(var key in existingRooms){
    var roomnameHTML = '<li class="existingRooms" role="presentation"><a role="menuitem" tabindex="-1" href="#">' + existingRooms[key] +'</a></li>';
    $('#roomnameList').append(roomnameHTML);
  }

  $('.existingRooms a').on('click', function(){
    var roomname = $(this).text();
    app.currentRoom = roomname;
    app.queryFilter.where = '{"roomname": \"'+ roomname +'\"}';
  });

};


setInterval(function(){
  app.init();
  // console.log("refresh");
}, 2000);

app.generateRoomnames();
setInterval(function(){
  app.generateRoomnames();
}, 15000);




// setInterval(app.init, 2000);
//
$('#send').on('click',function(){
  // console.log("send");

  console.log($("#message")[0].value);

  var message = {
    'username': app.username,
    'text': $("#message")[0].value,
    'roomname': app.currentRoom
  };

  app.send(message);

});

$('#createRoom').on('click',function(){
  var roomname = $("#roomname")[0].value;
  app.currentRoom = roomname;
  app.queryFilter.where = '{"roomname": \"'+ roomname +'\"}';
});







