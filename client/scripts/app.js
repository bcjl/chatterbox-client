// YOUR CODE HERE:
var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}


var message = {
  'username': 'foobar',
  'text': 'foobar',
  'roomname': 'foobar'
};

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


$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'GET',
  data: {limit: 1000, skip: 1000},
  contentType: 'application/json',

  success: function(data){
    console.log(data.results.length);
    // console.table(data.results);
    var results = data.results;
    results.forEach(function(msg){
      var username = escapeHtml(msg.username);
      var text = escapeHtml(msg.text);
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

// var updatePage = function(data){
//   return function(data){
//     console.log('chatterbox: GET success');
//     var res = data;
//     console.log('inside',data);
//   };
// };

