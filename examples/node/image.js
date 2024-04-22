const fs = require('fs')
const chef = require('../../dist/main.js')

let executor = new chef.Executor('Extract RGBA')
let imageData = fs.readFileSync('../assets/cat.jpg')
let result = executor.run(imageData.buffer, [',', true])
result.output.then(text => console.log(text))

executor = new chef.Executor('Resize Image')
imageData = fs.readFileSync('../assets/cat.jpg')
result = executor.run(imageData.buffer, [100, 100, 'Pixels', false, 'Bilinear'])
result.output.then(img => console.log(img))

