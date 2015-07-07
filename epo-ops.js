/*
Module name:     epo-ops
Description:     NodeJS module to access some basic EPO Open Patent Services
Source:          https://github.com/fvdm/nodejs-epo-ops
Feedback:        https://github.com/fvdm/nodejs-epo-ops/issues
License:         Unlicense (public domain) - see UNLICENSE file

Service name:    European Patent Office - Open Patent Services
Service docs:    http://www.epo.org/searching/free/ops.html
*/

var http = require('http'),
    app = {}

// Search worldwide
// constituents: 'abstract' (default), 'biblio', 'full-cycle', 'abstract,full-cycle', 'biblio,full-cycle'
app.search = function( query, constituents, cb ) {
	if( !cb && typeof constituents == 'function' ) {
		var cb = constituents
		var constituents = 'abstract'
	}
	
	app.talk( 'GET', 'published-data/search/'+ constituents +'?q='+ query, function( result ) {
		var results = {}
		result['ops:world-patent-data']['ops:biblio-search']['ops:search-result']['exchange-documents'].forEach( function( doc ) {
			
			var doc = doc['exchange-document']
			
			// fix document IDs
			var docId = doc['@doc-number']
			var docIds = {}
			doc['bibliographic-data']['publication-reference']['document-id'].forEach( function( did ) {
				docIds[ did['@document-id-type'] ] = did
			})
			doc['bibliographic-data']['publication-reference']['document-id'] = docIds
			docId = doc['bibliographic-data']['publication-reference']['document-id'].epodoc['doc-number']
			
			// add to results
			results[ docId ] = doc
			
		})
		
		cb( results )
	})
}

// Communicate
app.talk = function( method, path, fields, cb ) {
	if( !cb && typeof fields == 'function' ) {
		var cb = fields
		var fields = {}
	}
	
	var req = http.request(
		{
			host:		'ops.epo.org',
			path:		'/2.6.2/rest-services/'+ path,
			port:		80,
			method:		method,
			headers: {
				Accept:	'application/json'
			}
		},
		function( response ) {
			var data = ''
			response.setEncoding('utf8')
			response.on( 'data', function( chunk ) { data += chunk })
			response.on( 'end', function() {
				data = data.trim()
				data = JSON.parse( data )
				cb( data )
			})
		}
	)
	
	req.end()
}

// ready
module.exports = app
