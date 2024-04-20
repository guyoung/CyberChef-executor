const chef = require("../../dist/main.js")

console.log(chef.getOpCategories())
console.log(chef.getOpConfigs())

let executor = new chef.Executor("To Base64")
let encoded =  executor.run(Buffer.from("hello"), ["A-Za-z0-9+/="])   
console.log(encoded)

executor = new chef.Executor("From Base64")
let plain =  executor.run(encoded.output, ["A-Za-z0-9+/="])   
console.log(plain)
