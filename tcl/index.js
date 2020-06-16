/* Control de iluminación mediante wifi
 *****/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
//mariadb usa port 3306
const mysql = require('mysql');
const db = require('./db/mariadb');
var pool = mysql.createPool(db.config);//pool config
var estados = require('./estados');
//redis socket.io
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const router = express.Router()
//mqtt
var mqtt    = require('mqtt');
var simId = "0001";
var clientMqtt  = mqtt.connect("mqtt://localhost:1883",
    {   clientId: simId,
        keepalive: 1,
        clean: false,
        // Do not set to a value > 29 until this bug is fixed : https://github.com/mqttjs/MQTT.js/issues/346
        reconnectPeriod: 1000 * 1
    }
);
//redis
const redis = require('redis');
const redisStore = require('connect-redis')(session);
//const client  = redis.createClient();
const cookieParser = require('cookie-parser');
//configuracion de la session de express-session

Session = session({
    secret: 'secret',
    store: new session.MemoryStore(), //new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}), // create new redis store.
    resave: false, // mantiene la session de usuario sin actividad
    saveUninitialized: false, //guarda en el stores las sessiones uninitialized (sessiones nuevas sin actividad)
    rolling : true,           // reset del tiempo con la actividad del usuario
    cookie: {maxAge: 10*60*1000} // (10 min) tiempo ms para botar la session por inactividad
    });

app.use(Session); 

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(router);
app.use(express.static(path.join(__dirname, '/public'))); //servir static files
app.use('/', require('./routes/rutas'));

//Muestra la dirección IP v4
const os = require('os')
const interfaces = os.networkInterfaces();
Object.keys(interfaces).forEach(function(name){
  var alias = 0;
  interfaces[name].forEach(function(interfaz){
    if('IPv4' !== interfaz.family || interfaz.internal !== false){
      // skip 127.0.0.1 and non ipv4 addresses
      return}
    if(alias >= 1){
      //single interface with multiple ipv4 addresses
      console.log("ip:", name + ":" + alias, interfaz.address);}
    else{
      //interface with only ivp4 address
      console.log("ip:", name, interfaz.address);}
    alias++;
  });
});

var valores;
// rescatar estados de tableros desde db
Object.keys(estados.estados).forEach(x=>{
  //console.log("x=",x);
  pool.query(db.sql.tablero,[x], function(err, rows, fields) {
			if (err) {throw err; console.log("error:",err);}
      else {
			//console.log("rows:",rows);
			sqlRespuesta= rows;
      sqlRespuesta[0].estado==1 ? estados.estados[x]=1 : estados.estados[x]=0; 
      console.log("estados=",estados);
     }
		});
});  
//conexion a mosquito
clientMqtt.on('connect', function(){
    clientMqtt.subscribe('tableros/#', { qos: 1 });
    console.log('connected to the server. ID :', simId);
});

clientMqtt.on('message', function(topic, message) {
    // topic=tableros/T1/set message=ON   tableros/T1/set OFF
    topico = topic.toString().split("/");
    if(topico.length == 3) {
      console.log("largo 3");
      m = JSON.parse(message);
      if(topico[2] == "status"){
        console.log("message de estado:",topico[1],m,"m.accion", m["accion"],"avisar a clientes web y db");
        if(m["accion"] == "ON"){  
          console.log("on in");
                    estados.estados[topico[1]]=1;
                    valores = [topico[1],new Date(),1,"remoto",m["user"]]; //TODO quitar desde field
                    accion(db.sql.insertar, valores);
                    valores = []; 
                    io.emit('tablero',{tablero:topico[1],accion:"ON"});
          console.log("on out");
        }
        if(m["accion"] == "OFF"){  
          console.log("off in");
                    estados.estados[topico[1]]=0;
                    valores = [topico[1],new Date(),0,"remoto",m["user"]]; //TODO quitar desde field
                    accion(db.sql.insertar, valores);
                    valores = []; 
                    io.emit('tablero',{tablero:topico[1],accion:"OFF"});
          console.log("OFF out");
        }
      }
    }
});

clientMqtt.on("error", function(error) {
    console.log("ERROR: ", error);
});

clientMqtt.on('offline', function() {
    console.log("offline");
});

clientMqtt.on('reconnect', function() {
    console.log("reconnect");
});



io.use(function(socket, next) {
  Session(socket.handshake, {}, next);
});

  
io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');
    Object.keys(estados.estados).forEach(x=>{
      estados.estados[x]==1 ? socket.emit('tablero',{tablero: x, accion:"ON" }):
                              socket.emit('tablero',{tablero: x, accion:"OFF"});
    });
    
    pool.query(db.sql.grafico1,["T1"], function(err, rows, fields) {
      console.log("¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨¨");
			if (err) throw err;
			//console.log(rows);
			sqlRespuesta= rows;
			if (sqlRespuesta.length > 0) {
          console.log("sqlRespuesta0desde:",sqlRespuesta[0]['desde']);
          x=[];y=[];user=[];
          for(var i=0; i<sqlRespuesta.length; i++){
                          x.push(sqlRespuesta[i].fecha);  
                          y.push(sqlRespuesta[i].estado);
                          user.push(sqlRespuesta[i].user);}
          socket.emit("grafico",  {tablero:"T1",X:x,Y:y,user:user});
            console.log("emitido");
          	} 
			else {  console.log("erro en la sqlRespuesta");	} 			
		});
    
    
    
   
    
    socket.on('tablero', function(data) { 
      console.log('mensage',data);
      //se usa io.emit en vez de socket.emit para avisar a todos los clientes
      //console.log("client.connected:",client.connected);
      // console.log('socket.handshake', socket.handshake);
      //console.log("socket.handshake.session:",socket.handshake.session);
      //console.log("**************************************************");
      //console.log("_expires:",socket.handshake.session.cookie._expires);
      //console.log("originalMaxAge:",socket.handshake.session.cookie.originalMaxAge);
      
      if(new Date() < socket.handshake.session.cookie._expires && 
          typeof(socket.handshake.session.username) !== 'undefined' ) { 
            // reset de tiempo de expiracion de session
            console.log("session NO expirada, resetenado tiempos");
            socket.handshake.session.touch();
            socket.handshake.session.cookie._expires = 
                  new Date((new Date()).getTime()+socket.handshake.session.cookie.originalMaxAge);
            socket.handshake.session.save();
            //console.log("u:",socket.handshake.session.username);
            if(data.accion == "ON") {
              if(estados.estados[data.tablero] == 0){
                  //publicar el cambio
                  var a = JSON.stringify({"accion":"ON","user":socket.handshake.session.username});
                  clientMqtt.publish("tableros/"+ data.tablero +"/set", a , 
                  {qos: 1}, function(){console.log("message ON sent: ", a)});
              }
            }
            if(data.accion == "OFF") {
              if(estados.estados[data.tablero] == 1){
                  //publicar el cambio
                  var a = JSON.stringify({"accion":"OFF","user":socket.handshake.session.username});
                  clientMqtt.publish("tableros/"+ data.tablero +"/set", a , 
                  {qos: 1}, function(){console.log("message OFF sent ", a)});
              }
            }
              
          /*    
              //console.log("cambiar en db estado != 1");
                  //publicar
                  //esperar subripcion
              
              pool.query(db.sql.tablero,[data.tablero], function(err, rows, fields) {
              if (err) throw err;
                //console.log(rows);
                sqlRespuesta= rows;
              //console.log("sqlRespuesta:",sqlRespuesta,"largo:", sqlRespuesta.length);
              if(sqlRespuesta[0].estado != 1){
                  console.log("cambiar en db estado != 1");
                  //publicar
                  //esperar subripcion
                  valores = [data.tablero,new Date(),1,"remoto","admin"];
                  accion(db.sql.insertar, valores);
                  valores = []; 
                io.emit('tablero',{tablero:data.tablero,accion:"ON"});} 
              });
            }
            if(data.accion == "OFF"){
              pool.query(db.sql.tablero,[data.tablero], function(err, rows, fields) {
              if (err) throw err;
                  //console.log(rows);
                  sqlRespuesta= rows;
              //console.log("sqlRespuesta:",sqlRespuesta,"largo:", sqlRespuesta.length);
              if(sqlRespuesta[0].estado != 0){
                  console.log("cambiar en db estado != 0");
                  //publicar
                  //esperar subripcion
                  valores = [data.tablero, new Date(),0,"remoto","admin"];
                  accion(db.sql.insertar,valores);
                  valores = []; 
                  io.emit('tablero',{tablero:data.tablero,accion:"OFF"});} 
              });
            }*/
       }
       else { console.log("session expirada");
              socket.emit('redirect','home');}
    });
});

function accion(stmt,todo){
  pool.getConnection(function(err,connection){
    connection.query(stmt, todo, function(err, row, fields){ 
      if (err) throw err;
     // console.log("row:",row);
      connection.release();
    });
  });
}

server.listen(80, function() {
  console.log('Aplicación running, escuchando el puerto 80!');
});

