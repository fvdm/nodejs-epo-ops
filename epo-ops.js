/*
Module name: epo-ops
Description: Access some basic EPO Open Patent Services with node.js
Author: Franklin van de Meent (https://frankl.in);
Source & docs: https://github.com/fvdm/nodejs-epo-ops
Feedback: https://github.com/fvdm/nodejs-epo-ops/issues
License: Unlicense (public domain) - see UNLICENSE file

Service name: European Patent Office - Open Patent Services
Service docs: http://www.epo.org/searching/free/ops.html
*/

var http = require ('httpreq');
var app = {};

// Search worldwide
// constituents: 'abstract' (default), 'biblio', 'full-cycle', 'abstract,full-cycle', 'biblio,full-cycle';
app.search = function (query, constituents, cb) {
  if (!cb && typeof constituents === 'function') {
    var cb = constituents;
    var constituents = 'abstract';
  }

  var url = 'http://ops.epo.org/2.6.2/rest-services/published-data/search/'+ constituents;

  var opts = {
    parameters: { q: query },
    headers: { Accept: 'application/json' },
    timeout: 5000
  };

  http.get (url, opts, function (err, res) {
    var results = {};
    try {
      var result = JSON.parse (res.body);

      result ['ops:world-patent-data'] ['ops:biblio-search'] ['ops:search-result'] ['exchange-documents'] .forEach (function (doc) {
        var doc = doc ['exchange-document'];

        // fix document IDs
        var docId = doc ['@doc-number'];
        var docIds = {};
        doc ['bibliographic-data'] ['publication-reference'] ['document-id'] .forEach (function (did) {
          docIds [did ['@document-id-type']] = did;
        });
        doc ['bibliographic-data'] ['publication-reference'] ['document-id'] = docIds;
        docId = doc ['bibliographic-data'] ['publication-reference'] ['document-id'] .epodoc ['doc-number'];

        // add to results
        results [docId] = doc;
      });
    }
    catch (e) {}

    cb (results);
  });
};

// ready
module.exports = app;
