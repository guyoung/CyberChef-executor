# CyberChef-executor

GCHQ CyberChef  executor

[CyberChef](https://github.com/gchq/CyberChef) is a simple, intuitive web app for carrying out all manner of "cyber" operations within a web browser. These operations include simple encoding like XOR and Base64, more complex encryption like AES, DES and Blowfish, creating binary and hexdumps, compression and decompression of data, calculating hashes and checksums, IPv6 and X.509 parsing, changing character encodings, and much more.


## Usage


### Node.js / CommonJS

```javascript
var chef = require("cyberchef-executor")

console.log(chef.getOpCategories())
console.log(chef.getOpConfigs())

let executor = new chef.Executor('To Base64')
let encoded =  executor.run(Buffer.from('hello'), ['A-Za-z0-9+/='])   
console.log(encoded)

executor = new chef.Executor('From Base64')
let plain =  executor.run(encoded.output, ['A-Za-z0-9+/='])   
console.log(plain)

```