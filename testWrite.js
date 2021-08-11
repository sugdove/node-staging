const fs = require('fs')

const Json2csvParser = require('json2csv').Parser; 

const fields = [ 'id', 'name']

const objList = [
  {
    id: 111,
    name: 'hello'
  },
  {
    id: 222,
    name: 'hello2'
  }
]

const json2csvParser = new Json2csvParser({ fields });

const csv = json2csvParser.parse(objList);

fs.writeFileSync('./test.csv', csv )