'use strict';

const User = require('./users-model.js');

module.exports = (req, res, next) => {
  
  try {
    let [authType, authString] = req.headers.authorization.split(/\s+/);
    
    switch( authType.toLowerCase() ) {
      case 'basic': 
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default: 
        return _authError();
    }
  }
  catch(e) {
    next(e);
  }
  
  
  function _authBasic(str) {
    // str: am9objpqb2hubnk=
    let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
    let bufferString = base64Buffer.toString();    // john:mysecret
    let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
    let auth = {username,password}; // { username:'john', password:'mysecret' }
    
    return User.authenticateBasic(auth)
      .then(user => _authenticate(user) )
      .catch(next);
  }
  function _authBearer(authString) {
    // Vinicio - this is a very similar function to
    // 'authenticateBasic' but it starts by validating a token
    return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(next);
  }

  // function _authBearerWithTimeout(authString) {
  //   // Vinicio - this is a very similar function to
  //   // 'authenticateBasic' but it starts by validating a token
  //   return User.authenticateToken(authString)
  //       .then(user => _authenticate(user))
  //       .catch(next);
  // }

  // function _authBearer(authString) {
  //   // Vinicio - this is a very similar function to
  //   // 'authenticateBasic' but it starts by validating a token
  //   return User.authenticateToken(authString)
  //       .then(user => _authenticate(user))
  //       .catch(next);
  // }

  function _authenticate(user) {
    if(user) {
      req.user = user;
      req.token = user.generateToken();
      next();
    }
    else {
      _authError();
    }
  }

  // function _authenticate(user) {
  //   if(user) {
  //     req.user = user;
  //     req.token = user.timeOutgenerateToken();
  //     next();
  //   }
  //   else {
  //     _authError();
  //   }
  // }

  // function _authenticate(user) {
  //   if(user) {
  //     req.user = user;
  //     req.token = user.singleUsegenerateToken();
  //     next();
  //   }
  //   else {
  //     _authError();
  //   }
  // }
  
  function _authError() {
    next('Invalid User ID/Password');
  }
  
};