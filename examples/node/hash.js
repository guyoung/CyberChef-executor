const chef = require('../../dist/main.js')

let executor = new chef.Executor('SM3')
let result =  executor.run(Buffer.from('hello'), [256,64])   
console.log(result)
