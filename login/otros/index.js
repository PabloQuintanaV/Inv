/* index.js  Main - Server
*/
const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

dataBaseConfig = 'mongodb://localhost:27017/delta';

// Connecting mongoDB
mongoose.Promise = global.Promise;
mongoose.connect(dataBaseConfig, {
  useNewUrlParser: true
}).then(() => {
    console.log('Database connected sucessfully yeea!... ')
  },
  error => {
    console.log('Could not connected to database : ' + error)
  }
)

// Set up express js 
const alertaRoute = require('./routes/alertas.routes');
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false})); // true ?
app.use( cors() );
//app.use(express.static(path.join(__dirname, 'dist/angular8-meanstack-angular-material')));
//app.use('/', express.static(path.join(__dirname, 'dist/angular8-meanstack-angular-material')));
app.use('/alert', alertaRoute);

/*
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.get('/', function(req, res){
	//res.send("Hello world"); // hacia el browser	
	res.send( { data:Math.floor(Math.random() * (1000-1) + 1), 
				code:200,
				error:false} );
	console.log("requeimiento respondido");
	// res = {"data": 609,"code":200,"error":false} 
});

app.post("/example", (req,res)=>{
	res.send("Full NAME is: ${req.body.fname} ${req.body.lname}");
	console.log("post respondido");
}); */

 
// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Server running at '+ port +' port');
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200'); //***********
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});