# Standard Headers

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Lowercase array of [standard HTTP headers](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields).

## Installation

```
npm install standard-headers --save
```

## Usage

```js
var standardHeaders = require('standard-headers')

standardHeaders.request.indexOf('accept') //=> 0
```

## License

MIT license

[npm-image]: https://img.shields.io/npm/v/standard-headers.svg?style=flat
[npm-url]: https://npmjs.org/package/standard-headers
[downloads-image]: https://img.shields.io/npm/dm/standard-headers.svg?style=flat
[downloads-url]: https://npmjs.org/package/standard-headers
[travis-image]: https://img.shields.io/travis/blakeembrey/standard-headers.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/standard-headers
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/standard-headers.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/standard-headers?branch=master
