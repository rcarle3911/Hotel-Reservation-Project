# Popsicle Basic Auth

[![NPM version][npm-image]][npm-url]
[![NPM downloads][downloads-image]][downloads-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Add basic authentication to requests.

## Installation

```
npm install popsicle-basic-auth --save
```

## Usage

```javascript
var request = require('popsicle');
var auth    = require('popsicle-basic-auth');

request('/users.json')
  .use(auth('blakeembrey', 'hunter2'));
```

## License

MIT

[npm-image]: https://img.shields.io/npm/v/popsicle-basic-auth.svg?style=flat
[npm-url]: https://npmjs.org/package/popsicle-basic-auth
[downloads-image]: https://img.shields.io/npm/dm/popsicle-basic-auth.svg?style=flat
[downloads-url]: https://npmjs.org/package/popsicle-basic-auth
[travis-image]: https://img.shields.io/travis/blakeembrey/popsicle-basic-auth.svg?style=flat
[travis-url]: https://travis-ci.org/blakeembrey/popsicle-basic-auth
[coveralls-image]: https://img.shields.io/coveralls/blakeembrey/popsicle-basic-auth.svg?style=flat
[coveralls-url]: https://coveralls.io/r/blakeembrey/popsicle-basic-auth?branch=master
