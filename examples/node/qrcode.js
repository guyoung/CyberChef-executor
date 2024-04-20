const chef = require("../../dist/main.js")

let executor = new chef.Executor('Image', 'Generate QR Code')
let outImage = executor.run('hello', ['PNG', 5, 4, 'Medium'])
console.log(outImage)

executor = new chef.Executor('Image', 'Parse QR Code')
let outText = executor.run(outImage.output, [false])
outText.output.then(text => console.log(text))
