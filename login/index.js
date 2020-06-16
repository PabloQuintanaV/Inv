//pruebas de user login contra db mariadb
//https://riptutorial.com/node-js/example/4587/using-a-connection-pool
//https://jilles.me/express-routing-the-beginners-guide/
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const redis = require('redis');
const redisStore = require('connect-redis')(session);

const client  = redis.createClient();
const app = express();
const router = express.Router();

app.use(session({
	secret: 'secret',
	store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}), // create new redis store.
	resave: false, // mantiene la session de usuario sin actividad
	saveUninitialized: false, //guarda en el stores las sessiones uninitialized (sessiones nuevas sin actividad)
	rolling : true,           // reset del tiempo con la actividad del usuario
	cookie: {maxAge: 1*30*1000} // (10 min) tiempo ms para botar la session por inactividad
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(router);
app.use(express.static(path.join(__dirname, '/public'))); //servir static files

var rutas = require('./routes/rutas');
app.use('/', rutas);

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/login.html'));
});

app.listen(80, function() {
  console.log('Aplicación running, escuchando el puerto 80!');
});
