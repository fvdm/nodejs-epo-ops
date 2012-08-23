[![build status](https://secure.travis-ci.org/fvdm/nodejs-epo-ops.png)](http://travis-ci.org/fvdm/nodejs-epo-ops)
# epo-ops

NodeJS module to access some basic EPO Open Patent Services

# Installation

With NPM:

```
npm install epo-ops
```

From source

```
git clone https://github.com/fvdm/nodejs-epo-ops
npm install ./nodejs-epo-ops
```

# Usage

```js
var ops = require('epo-ops')

ops.search( 'test', function( results ) {
	results.forEach( function( doc, docId ) {
		console.log( docId +': '+ doc.abstract.p[0]['$'] )
	})
})
```

# Methods

## search
### ( query, [constituents], callback )

Search patents worldwide.

<table>
	<th>parameter</th>
	<th>description</th>
	<th>required</th>
	<th>values</th>
	<th>default</th>
	<tr>
		<td>query</td>
		<td>keywords to search on</td>
		<td>yes</td>
		<td>text</td>
		<td></td>
	</tr>
	<tr>
		<td>constituents</td>
		<td>result type</td>
		<td>optional</td>
		<td>
			abstract<br>
			biblio<br>
			full-cycle<br>
			abstract,full-cycle<br>
			biblio,full-cycle
		</td>
		<td>abstract</td>
	</tr>
	<tr>
		<td>callback</td>
		<td>function called when results are ready</td>
		<td>yes</td>
		<td>resultsObject</td>
		<td></td>
	</tr>
</table>

## talk
### ( method, path, [fields], callback )

Communicate with the service.

<table>
	<th>parameter</th>
	<th>description</th>
	<th>required</th>
	<th>values</th>
	<th>default</th>
	<tr>
		<td>method</td>
		<td>HTTP method</td>
		<td>yes</td>
		<td>GET, POST, PUT, DELETE</td>
		<td></td>
	</tr>
	<tr>
		<td>path</td>
		<td>Request URL path after `/2.6.2/rest-services/`</td>
		<td>yes</td>
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>fields</td>
		<td>GET or POST parameters</td>
		<td>no</td>
		<td>object</td>
		<td></td>
	</tr>
	<tr>
		<td>callback</td>
		<td>function called when results are ready</td>
		<td>yes</td>
		<td>resultsObject</td>
		<td></td>
	</tr>
</table>

# Unlicense

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