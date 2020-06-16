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
      cookie: {maxAge: 2*60*1000} 
    });

app.use(express.static(path.join(__dirname, '/public'))); //servir static files
app.use(Session);

io.use(function(socket, next) {
  Session(socket.handshake, {}, next);
});

io.on('connection', function(socket){
  console.log('a user connected', socket.handshake.sessionID);
   socket.on('tablero', function(data) { 
      console.log('mensage',data);
     // console.log('loged?.',socket.request.session.loggedin); nada
     // console.log('name?.',socket.request.session.username); nada
     //console.log('socket.req?.',socket.req); NADA
     console.log('handshake', socket.handshake.sessionID);
     console.log('handshake', socket.handshake);
    });
});

app.get('/', (req, res) => {
	console.log("enviando pagina");
	req.session.loggedin = true;
	req.session.username = "uername";
	res.sendFile(path.join(__dirname, './public/tcl.html'))}
);

server.listen(80, function() {
  console.log('Aplicación running, escuchando el puerto 80!');
});

/*
mensage { tablero: 'T1', accion: 'ON' }
handshake wRcfZGV8BCuADCGcftiiC2xDvUAbSshB
handshake {
  headers: {
    host: 'localhost',
    connection: 'keep-alive',
    accept: '*/ /*
    'user-agent': 'Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Raspbian Chromium/78.0.3904.108 Chrome/78.0.3904.108 Safari/537.36',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'cors',
    referer: 'http://localhost/',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'es-US,es;q=0.9,es-419;q=0.8,en;q=0.7',
    cookie: 'io=Tb3CCrnstu1IhA5rAAAA; connect.sid=s%3AwRcfZGV8BCuADCGcftiiC2xDvUAbSshB.2BMaIo1lgdIZmVhNx4Gp8RSOgPlIxrow97NLAM%2Bhs%2B8'
  },
  time: 'Sat Jun 06 2020 15:48:41 GMT-0400 (GMT-04:00)',
  address: '::1',
  xdomain: false,
  secure: false,
  issued: 1591472921176,
  url: '/socket.io/?EIO=3&transport=polling&t=NABBPan',
  query: { EIO: '3', transport: 'polling', t: 'NABBPan' },
  _parsedUrl: Url {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '?EIO=3&transport=polling&t=NABBPan',
    query: 'EIO=3&transport=polling&t=NABBPan',
    pathname: '/socket.io/',
    path: '/socket.io/?EIO=3&transport=polling&t=NABBPan',
    href: '/socket.io/?EIO=3&transport=polling&t=NABBPan',
    _raw: '/socket.io/?EIO=3&transport=polling&t=NABBPan'
  },
  sessionStore: MemoryStore {
    _events: [Object: null prototype] {
      disconnect: [Function: ondisconnect],
      connect: [Function: onconnect]
    },
    _eventsCount: 2,
    _maxListeners: undefined,
    sessions: [Object: null prototype] {
      wRcfZGV8BCuADCGcftiiC2xDvUAbSshB: '{"cookie":{"originalMaxAge":119999,"expires":"2020-06-06T19:50:08.060Z","httpOnly":true,"path":"/"},"loggedin":true,"username":"uername"}'
    },
    generate: [Function],
    [Symbol(kCapture)]: false
  },
  sessionID: 'wRcfZGV8BCuADCGcftiiC2xDvUAbSshB',
  session: Session {
    cookie: {
      path: '/',
      _expires: 2020-06-06T19:50:08.060Z,
      originalMaxAge: 119999,
      httpOnly: true
    },
    loggedin: true,
    username: 'uername'
  }
}
*/
