const fs = require('fs')

const dataBuffer = fs.readFileSync('1-json.json')

const dataJSON = dataBuffer.toString()
const data = JSON.parse(dataJSON)

console.log("🚀 ~ file: 1-json.js ~ line 6 ~ data", data)

data.name = 'Sam'

const dataString = JSON.stringify(data)
console.log("🚀 ~ file: 1-json.js ~ line 12 ~ dataString", dataString)

fs.writeFileSync('1-json.json', dataString)
