/* alertaa.routes.js definicion de alertas para server express
*/ 

const express = require('express');
const app = express();
const alertaRoute = express.Router();

// Alerta model
let Alerta = require('../models/alertas');

// agregar Alerta
alertaRoute.route('/add-alerta').post((req, res, next) => {
  Alerta.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get all alertas
alertaRoute.route('/alertas').get((req, res) => {
  Alerta.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single Alerta
alertaRoute.route('/read-alerta/:id').get((req, res) => {
  Alerta.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Update Alerta
alertaRoute.route('/update-alerta/:id').put((req, res, next) => {
  Alerta.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Alerta successfully updated!')
    }
  })
})

// Delete Alerta
alertaRoute.route('/delete-alerta/:id').delete((req, res, next) => {
  Alerta.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = alertaRoute;