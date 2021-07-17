const fs = require('fs')

fs.writeFile('./log.txt','hello world!', (err, data) => {
  if(err){
    console.error(err)
  }
  else{
    console.log('文件write成功')
  }
})

fs.readFile('./log.txt','utf-8', (err, data) => {
  if(err){
    console.error(err)
  }
  else{
    console.log(data)
  }
})