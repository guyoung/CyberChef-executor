const chef = require('../../dist/main.js')

let executor = new chef.Executor('XOR')
let result =  executor.run(Buffer.from('hello'), [
    {'option':'Hex','string':'12345'},'Standard',false])   
console.log(result)
console.log(Buffer.from(result.output).toString())
