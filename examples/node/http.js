const chef = require('../../dist/main.min.js')



let executor = new chef.Executor('HTTP request')
let res = executor.run('https://reqres.in/api/users', ['GET',
    'https://reqres.in/api/users', '', 'Cross-Origin Resource Sharing', false])

res.output.then(res => console.log(res))
