var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app, { log: true })
  , fs = require('fs')

app.listen(80, '10.69.0.9');

io.set('log level', 1); // reduce logging

function handler (req, res) {

  if (req.url === '/') req.url = '/index.html';
  console.info('Loading '+ __dirname + req.url);

  var contentType = "text/html";

  if (req.url === '/injection_script.js') contentType = 'text/javascript';
  if (req.url === '/socket-script.js') contentType = 'text/javascript';

  fs.readFile(__dirname + req.url,
  //fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading '+req.url);
    }

    res.writeHead(200, { 'Content-Type': contentType } );
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  var ra = socket.connection;
  console.dir(ra);
  
  var address = socket.handshake.address;
  console.dir({ address: address.address, port: address.port });
 
  var endpoint = socket.manager.handshaken[socket.id].address;
  console.log('Client connected from: ' + endpoint.address + ":" + endpoint.port);
  
  socket.on('news', function (data) {
    console.log(data);
  });
  // help a client broadcast news to all
  socket.on('broadcast-news', function (data) {
    io.sockets.emit('news', data);
  });
  // help a client broadcast news to all
  socket.on('broadcast', function (data) {
    io.sockets.emit('news', data);
  });
  socket.on('location', function (data) {
    console.log('Got a Location:');
    console.log(data);
  });
  
  socket.emit('news', 'Welcome to socket.io server. You are online. New connection: '+ address.address+' port: '+address.port);

});