# Osprey Resources

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Iterate over [RAML resources](https://github.com/raml-org/raml-spec/blob/master/raml-0.8.md#resources-and-nested-resources) and generate a middleware router.

## Installation

```
npm install osprey-resources --save
```

## Usage

```js
var express = require('express');
var resources = require('osprey-resources');
var app = express();

app.use(resources(
  [{
    relativeUri: '/users',
    methods: [{
      method: 'post',
      body: {
        'application/json': {
          schema: '...'
        }
      }
    }]
  }],
  function (method, path) {
    return function (req, res, next) {
      res.end('hello, world!')
    }
  }
));
```

The resources function accepts two arguments. The array of resources from RAML and a function that will generate the route for that path. Return `null` if the route should not be used.

## License

MIT license

[npm-image]: https://img.shields.io/npm/v/osprey-resources.svg?style=flat
[npm-url]: https://npmjs.org/package/osprey-resources
[downloads-image]: https://img.shields.io/npm/dm/osprey-resources.svg?style=flat
[downloads-url]: https://npmjs.org/package/osprey-resources
[travis-image]: https://img.shields.io/travis/mulesoft-labs/osprey-resources.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft-labs/osprey-resources
[coveralls-image]: https://img.shields.io/coveralls/mulesoft-labs/osprey-resources.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft-labs/osprey-resources?branch=master
