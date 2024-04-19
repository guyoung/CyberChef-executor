const chef = require("../../dist/main.js");

//console.log(chef)

//console.log(chef.getOpCategories())
//console.log(chef.getOpConfigs())

let executor = new chef.Executor("To Base64");
let encoded =  executor.run(Buffer.from("hello"), ["A-Za-z0-9+/="])   
console.log(encoded)

executor = new chef.Executor("From Base64"); 
let plain =  executor.run(encoded.output, ["A-Za-z0-9+/="])   
console.log(plain)


executor = new chef.Executor("Compression", "Gzip")
let compressed = executor.run(Buffer.from("hello"), [
    "Dynamic Huffman Coding", "", "", false])
console.log(compressed)

executor = new chef.Executor("Compression", "Gunzip",  null)
plain = executor.run(compressed.output)
console.log(plain)
console.log(Buffer.from(plain.output).toString()) 


executor = new chef.Executor("Ciphers", "Blowfish Encrypt")
let encrypted =  executor.run("hello", [
    {'option':'Hex','string':'12345678'},
    {'option':'Hex','string':'1234567812345678'},
    'CBC','Raw','Hex'])
console.log(encrypted)


executor = new chef.Executor("Ciphers", "Blowfish Decrypt")
plain =  executor.run(encrypted.output, [
    {'option':'Hex','string':'12345678'},
    {'option':'Hex','string':'1234567812345678'},
    'CBC','Hex','Raw'])
console.log(plain)
