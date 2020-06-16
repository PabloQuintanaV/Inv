const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

Session = session({
      store:  new session.MemoryStore(),
      secret: 'pass',
      resave: false, // mantiene la session de usuario sin actividad
      saveUninitialized: false, //guarda en el stores las sessiones uninitialized (sessiones nuevas sin actividad)
      rolling : true,    
      cookie: {maxAge: 1*30*1000} 
    });

app.use(express.static(path.join(__dirname, '/public'))); //servir static files
app.use(Session);

io.use(function(socket, next) {
  Session(socket.request, socket.response || {}, next);
});

io.on('connection', function(socket){
  console.log('a user connected',socket.request.session);
  
   socket.on('tablero', function(data) { 
      console.log('mensage',data,socket.request.session);
      //console.log('loged?.',socket.request.session.loggedin); NADA
      //console.log('name?.',socket.request.session.username);  NADA
     console.log('session?.',socket.request.session);
    });
});

app.get('/', (request, response) => {
	request.session.loggedin = true;
	request.session.username = "uername";
response.sendFile(path.join(__dirname, './public/tcl.html'))}
);


server.listen(80, function() {
  console.log('Aplicación running, escuchando el puerto 80!');
});
