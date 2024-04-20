const chef = require("../../dist/main.js")

let executor = new chef.Executor('Compression', 'Gzip')
let compressed = executor.run(Buffer.from('hello'), [
    'Dynamic Huffman Coding', '', '', false])
console.log(compressed)

executor = new chef.Executor('Compression', 'Gunzip',  null)
let plain = executor.run(compressed.output)
console.log(plain)
console.log(Buffer.from(plain.output).toString()) 
