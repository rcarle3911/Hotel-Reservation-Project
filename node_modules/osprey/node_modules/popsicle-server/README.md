# Popsicle Server

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Automatically connect HTTP(s) servers to a randomly available port for each request. Makes testing your Express/Connect/Node servers easy!

## Installation

```
npm install popsicle-server --save
```

## Usage

```js
var request = require('popsicle')
var server = require('popsicle-server')
var express = require('express')
var app = express()

request('/users')
  .use(server(app))
  .then(function (res) {
    console.log(res.status) //=> 404
  })
```

## License

MIT license

[npm-image]: https://img.shields.io/npm/v/popsicle-server.svg?style=flat
[npm-url]: https://npmjs.org/package/popsicle-server
[travis-image]: https://img.shields.io/travis/blakeembrey/popsicle-server.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/popsicle-server
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/popsicle-server.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/popsicle-server?branch=master
[downloads-image]: https://img.shields.io/npm/dm/popsicle-server.svg?style=flat
[downloads-url]: https://npmjs.org/package/popsicle-server
