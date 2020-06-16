const mysql = require('mysql');
const express = require('express');
const app = express();
const router = express.Router();

const db = require('../db/mariadb.js');
var pool = mysql.createPool(db.config);
var sqlRespuesta = [];


router.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	//console.log("user:",username,"pass:", password);
	if (username && password) {
		pool.query(db.sql.usuarios,[username,password], function(err, rows, fields) {
			if (err) throw err;
			console.log(rows);
			sqlRespuesta= rows;
			console.log("sqlRespuesta:",sqlRespuesta,"largo:", sqlRespuesta.length);
			if (sqlRespuesta.length > 0) {
					console.log("interior");
					req.session.loggedin = true;
					req.session.username = username;
					res.redirect('/home');
				} 
			else {
					console.log("out1");
					res.send({respuesta:"Usuario o Password incorrecta"});
				} 			
			res.end();
		});
   }
   else {
		res.send({respuesta:"Por favor ingresar Usuario y Password"});
		res.end();
	}
});
	
router.get('/home', function(req, res) {
	if (req.session.loggedin) {
		res.send('Welcome back, ' + req.session.username + '!');
	} else {
		res.redirect('/');
		//res.send('Please login to view this page!');
	}
	res.end();
});
	  
router.get('/logout',function(req,res){
    sessionData = req.session;    
    sessionData.destroy(function(err) {
        if(err){
            msg = 'Error destroying session';
            res.json(msg);
        }
        else{
            msg = 'Session destroy successfully';
            console.log(msg)
            //res.json(msg);
            res.redirect('/');
        }
    });
});

module.exports = router;
