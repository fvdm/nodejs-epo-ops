/*
Module name:    epo-ops
Description:    Access some basic EPO Open Patent Services with node.js
Author:         Franklin van de Meent (https://frankl.in);
Source & docs:  https://github.com/fvdm/nodejs-epo-ops
Feedback:       https://github.com/fvdm/nodejs-epo-ops/issues
License:        Unlicense (public domain) - see UNLICENSE file

Service name:   European Patent Office - Open Patent Services
Service docs:   http://www.epo.org/searching/free/ops.html
*/

var xml2json = require ('simple-xml2json') .parser;
var http = require ('httpreq');

var config = {};
var app = {
  status: {}
};

/**
 * Base64 encode a string
 *
 * @param {String} str
 * @return {void}
 */
function base64_encode (str) {
  return new Buffer (str, 'utf8') .toString ('base64');
}

/**
 * Send HTTP request to API
 *
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback
 * @return {void}
 */
function talk (method, path, params, callback) {
  var options = {
    url: 'https://ops.epo.org/3.1' + path,
    parameters: params,
    method: method,
    timeout: config.timeout,
    headers: {
      'User-Agent': 'epo-ops.js (https://github.com/fvdm/nodejs-epo-ops)'
    }
  };

  if (config.access_token) {
    options.headers.Authorization = 'Bearer ' + config.access_token;
  } else {
    options.auth = base64_encode (config.consumer_key + ':' + config.consumer_secret);
  }

  http.doRequest (options, function (err, res) {
    var data = null;
    var error = null;
    var key;

    if (err) {
      return callback (err);
    }

    try {
      data = xml2json (res.body);

      if (data.error) {
        error = new Error ('API error');
        error.error = data.error;
        data = null;
      }
    } catch (e) {
      error = e;
    }

    if (res.headers instanceof Object) {
      for (key in res.headers) {
        if (key.match (/^x_/)) {
          app.status [key] = res.headers [key];
        }
      }
    }

    callback (error, data);
  });
}

/**
 * Get access_token from API
 *
 * @param {Function} callback
 * @return {void}
 */
app.accessToken = function oauth_accesstoken (callback) {
  var params = {
    grant_type: 'client_credentials'
  };

  talk ('POST', '/auth/accesstoken', params, function (err, data) {
    if (err) {
      return callback (err);
    }

    if (data.access_token) {
      config.access_token = data.access_token;
    }

    callback (null, data);
  });
}

/**
 * Authenticated HTTP request
 *
 * @param {String} path
 * @param {Object} params
 * @param {Function} callback
 * @return {void}
 */
app.get = function oauth_get (path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = null;
  }

  talk ('GET', path, params, callback);
};


/**
 * Module configuration
 * returns object with methods
 *
 * @param {Object} params
 * @return {Object}
 */
module.exports = function (params) {
  var key;

  for (key in params) {
    config [key] = params [key];
  }

  return app;
};
