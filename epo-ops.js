/*
Module name:     epo-ops
Description:     NodeJS module to access some basic EPO Open Patent Services
Source:          https://github.com/fvdm/nodejs-epo-ops
Feedback:        https://github.com/fvdm/nodejs-epo-ops/issues

Service name:    European Patent Office - Open Patent Services
Service docs:    http://www.epo.org/searching/free/ops.html


This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
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
