'use strict';
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

const modelsFolder = `${__dirname}/../models`;

/**
   * Get the model param for the route call and appends the equivalent model to the request
   * @param req {} route request object
   * @param res {} route response object
   * @param next f() express function to call next middleware or handler in routing chain
   * @returns null
   */
const load = (req, res, next) => {
  let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
  const Model = require(`../models/${modelName}/${modelName}-model.js`);
  req.model = new Model();
  next();
};

/**
   * Get the model param for the route call and appends the equivalent model to the request
   * @param req {} route request object
   * @param res {} route response object
   * @param next f() express function to call next middleware or handler in routing chain
   * @returns null
   */
const list = () => {
  return readdir(modelsFolder)
    .then(contents =>
      contents.filter((entry) =>
        fs.lstatSync(`${modelsFolder}/${entry}`).isDirectory() && fs.statSync(`${modelsFolder}/${entry}/${entry}-model.js`)
      )
    )
    .catch(console.error);
};

module.exports = { load, list };
