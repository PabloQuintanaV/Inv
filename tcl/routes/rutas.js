const mysql = require('mysql');
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

const db = require('../db/mariadb.js');
var pool = mysql.createPool(db.config);//pool config
var sqlRespuesta = [];

router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public/login.html'));
	
});

router.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	console.log("user:",username,"pass:", password);
	if (username && password) {
		pool.query(db.sql.usuarios,[username,password], function(err, rows, fields) {
			if (err) throw err;
			//console.log(rows);
			sqlRespuesta= rows;
			//console.log("sqlRespuesta:",sqlRespuesta,"largo:", sqlRespuesta.length);
			if (sqlRespuesta.length > 0) {
					req.session.loggedin = true;
					req.session.username = username;
					console.log(" session");
					res.redirect('/tcl');
				} 
			else {  //console.log("out1");
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
	
router.get('/tcl', function(req, res) {
	console.log("/tcl");
	if (req.session.loggedin) {
		//res.send('Welcome back, ' + req.session.username + '!');
		console.log("path",path.join(__dirname, '../public/tcl.html'));
		res.sendFile(path.join(__dirname, '../public/tcl.html'));
		
	} 
	else {res.redirect('/');			}
	
});
	  
router.get('/logout',function(req,res){
    sessionData = req.session;    
    sessionData.destroy(function(err) {
        if(err){
            msg = 'Error destroying session';
            //res.json(msg);
	    console.log(msg);
        }
        else{
            msg = 'Session destroy successfully';
            console.log(msg)
            //res.json(msg);
            res.redirect('/');
        }
        res.end();
    });
});

module.exports = router;
