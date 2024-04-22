const chef = require('../../dist/main.js')

let executor = new chef.Executor('AES Encrypt')
let encrypted = executor.run('hello', [
    { 'option': 'UTF8', 'string': '1234567812345678' },
    { 'option': 'UTF8', 'string': '1234567812345678' },
    'CBC', 'Raw', 'Hex',
    { 'option': 'Hex', 'string': '' }])
console.log(encrypted)


executor = new chef.Executor('AES Decrypt')
let plain = executor.run(encrypted.output, [
    { 'option': 'UTF8', 'string': '1234567812345678' },
    { 'option': 'UTF8', 'string': '1234567812345678' },
    'CBC', 'Hex', 'Raw',
    { 'option': 'Hex', 'string': '' },
    { 'option': 'Hex', 'string': '' }])
console.log(plain)



executor = new chef.Executor('Blowfish Encrypt')
encrypted = executor.run('hello', [
    { 'option': 'Hex', 'string': '12345678' },
    { 'option': 'Hex', 'string': '1234567812345678' },
    'CBC', 'Raw', 'Hex'])
console.log(encrypted)


executor = new chef.Executor('Blowfish Decrypt')
plain = executor.run(encrypted.output, [
    { 'option': 'Hex', 'string': '12345678' },
    { 'option': 'Hex', 'string': '1234567812345678' },
    'CBC', 'Hex', 'Raw'])
console.log(plain)