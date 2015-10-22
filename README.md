epo-ops
=======

Access some basic EPO Open Patent Services with node.js


Example
-------

```js
var ops = require ('epo-ops') ({
  consumer_key: 'abc123',
  consumer_secret: '987xyz'
});

ops.get ('/developers/me/stats/usage', { timeRange: '01-01-2015' }, console.log);
```


Installation
------------

Normal: `npm install epo-ops`

Development: `npm install fvdm/nodejs-epo-ops#develop`


Methods
-------

Each method below takes a callback _function_ to process the results.
This callback receives two arguments: `err` and `data`.
When an error occurs, `err` is an instance of _Error_.
When everything is alright `err` is _null_ and `data` is the result.


### Errors

message        | description                | properties
request failed | The request cannot be made |
API error      | The API returned an error  | `error`


### .get
**( path, [params], callback )**

Get a resource.


parameter | type     | required | default  | description
:---------|:---------|:---------|:---------|:-----------------
path      | string   | yes      |          | Resource path part after `/3.1`
params    | object   | no       |          | Resource parameters
callback  | function | yes      |          | Callback function


```js
var params = {
  timeRange: '01-01-2015'
};

ops.get ('/developers/me/stats/usage', params, console.log);
```


### .accessToken
**( callback )**

Get a new access token.


parameter | type     | required | default  | description
:---------|:---------|:---------|:---------|:-----------------
callback  | function | yes      |          | Callback function


```js
ops.accessToken (function (err, res) {
  if (err) {
    return console.log (err);
  }

  console.log ('New access_token: %s', res.access_token);
});
```


### .status

Status is an _object_ with quota and access information from the API.
A request must already been made to populate this object.


```js
ops.accessToken (function (err, res) {
  console.log (ops.status);
});
```



Unlicense
---------

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


Author
------

Franklin van de Meent
| [Website](https://frankl.in)
| [Github](https://github.com/fvdm)
