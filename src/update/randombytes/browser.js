'use strict'

// limit of Crypto.getRandomValues()
// https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
var MAX_BYTES = 65536

// Node supports requesting up to this number of bytes
// https://github.com/nodejs/node/blob/master/lib/internal/crypto/random.js#L48
var MAX_UINT32 = 4294967295

/***
function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}
***/

var Buffer = require('safe-buffer').Buffer
/***
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}
***/

/***{ modified by guyoung ***/
var MersenneTwister = require('mersenne-twister')

var twister = new MersenneTwister(Math.random() * Number.MAX_SAFE_INTEGER)


function randomFloat() {
  return twister.random()
}



function getRandomValues(abv) {
  var l = abv.length
  while (l--) {
    abv[l] = Math.floor(randomFloat() * 256)
  }
  return abv
}
/*** modified by guyoung }***/

function randomBytes(size, cb) {
  // phantomjs needs to throw
  if (size > MAX_UINT32) throw new RangeError('requested too many random bytes')

  var bytes = Buffer.allocUnsafe(size)

  if (size > 0) {  // getRandomValues fails on IE if size == 0
    if (size > MAX_BYTES) { // this is the max bytes crypto.getRandomValues
      // can do at once see https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
      for (var generated = 0; generated < size; generated += MAX_BYTES) {
        // buffer.slice automatically checks if the end is past the end of
        // the buffer so we don't have to here
        /***{ modified by guyoung ***/
        getRandomValues(bytes.slice(generated, generated + MAX_BYTES))
        /*** modified by guyoung }***/
      }
    } else {
      /***{ modified by guyoung ***/
      getRandomValues(bytes)
      /*** modified by guyoung }***/
    }
  }

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

/***{ modified by guyoung ***/
module.exports = randomBytes
/*** modified by guyoung }***/