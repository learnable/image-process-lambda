# arraymap
> Curried function deriving new array values by applying provided function to each item/index of provided array. Fast and compatible with modern or old browsers.

[![Build Status](http://img.shields.io/travis/wilmoore/arraymap.js.svg)](https://travis-ci.org/wilmoore/arraymap.js) [![Code Climate](https://codeclimate.com/github/wilmoore/arraymap.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/arraymap.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install arraymap --save
```

> You can also use Duo, Bower or [download the files manually](https://github.com/wilmoore/arraymap.js/releases).

###### npm stats

[![npm](https://img.shields.io/npm/v/arraymap.svg)](https://www.npmjs.org/package/arraymap) [![NPM downloads](http://img.shields.io/npm/dm/arraymap.svg)](https://www.npmjs.org/package/arraymap) [![David](https://img.shields.io/david/wilmoore/arraymap.js.svg)](https://david-dm.org/wilmoore/arraymap.js)

## Overview

Optionally, a dot-notation formatted string may be provided for item property access.

## API Example

###### Pointful

```js
var map = require('arraymap')
var characters = ['a', 'b', 'c']
var codepoints = (letter) => punycode.ucs2.decode(letter)[0]

map(codepoints, characters)
//=> [ 97, 98, 99 ]
```

###### Pointful (dot-notation object access)

```js
var map = require('arraymap')
var collection = [ { letter: 'a' }, { letter: 'b' }, { letter: 'c' }  ]

map('letter', collection)
//=> ['a', 'b', 'c']
```

###### Pointfree Style

```js
var map = require('arraymap')
var collection = [ { letter: 'a' }, { letter: 'b' }, { letter: 'c' }  ]
var promise = Promise.resolve(collection)

promise.then(map('letter'))
//=> ['a', 'b', 'c']
```

## API

### `map(fn, list)`

###### arguments

 - `fn (Function|String)`.
 - `list (array)`.

###### returns

 - `(array)` Array resulting from applying provided function `fn` to each item of `list`.

## Alternatives

 - [Array.prototype.map()]: difficult to compose, not curried.
 - [array-map]: not curried.
 - [curried-map]: does not support dot-notation string accessor.

## Contributing

> SEE: [contributing.md](contributing.md)

## Licenses

[![GitHub license](https://img.shields.io/github/license/wilmoore/arraymap.js.svg)](https://github.com/wilmoore/arraymap.js/blob/master/license)

[Array.prototype.map()]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
[array-map]: https://www.npmjs.com/package/array-map
[curried-map]: https://www.npmjs.com/package/curried-map
