'use strict';

const express = require('express');
const authRouter = express.Router();
const model = require('./DB/memory.js')


const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');


const memoryModel = new model();

authRouter.post('/newPerson', (req, res, next) => {
    memoryModel.create(req.body);
});

authRouter.get('/people', (req, res, next) => {
    memoryModel.get();
});

authRouter.put('/updatePerson', (req, res, next) => {
    memoryModel.update(req.body);
});

authRouter.delete('/deletePerson', (req, res, next) => {
    memoryModel.delete(req.body);
});

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

authRouter.post('/signin', auth, (req, res, next) => {
    // get rid of old token, create a new one and send it
    if(req.token) {
        generateToken();

    }
  res.cookie('auth', req.token);
  res.send(req.token);
});

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

module.exports = authRouter;


