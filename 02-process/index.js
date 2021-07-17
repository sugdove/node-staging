console.log(process.argv.slice(2)) // 命令查看
console.log(process.env.Path.split(':').join('\n')) //path查看
console.log(process.arch) // 操作系统位数查看
console.log(process.platform) // 操作系统查看
console.log(process.memoryUsage()) // 获取内存使用情况