const chef = require('../../dist/main.js')

let executor = new chef.Executor('Generate RSA Key Pair')
let result = executor.run('', ['1024', 'PEM'])
result.output.then(text => console.log(text))