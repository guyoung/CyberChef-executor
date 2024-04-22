const chef = require('../../dist/main.js')

let executor = new chef.Executor('To Hex')
let encoded =  executor.run(Buffer.from('hello'), ['Space',0])   
console.log(encoded)


executor = new chef.Executor('From Hex')
let plain =  executor.run(encoded.output, ['Auto'])   
console.log(plain)
console.log(plain.output)
console.log(Buffer.from(plain.output).toString())

//executor = new chef.Executor('URL Encode')      


//executor = new chef.Executor('URL Decode')