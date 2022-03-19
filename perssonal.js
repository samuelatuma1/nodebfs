// const fs = require("fs")
// const path = require("path")
// const write = fs.createWriteStream(path.join(__dirname, 'fliex.html'))

// write.write("I am a big fan of my laptop?")
// const read = fs.createReadStream(path.join(__dirname, 'fliex.html'))

// const writeNew = fs.createWriteStream(path.join(__dirname, 'newWrite.html'))

// // read.pipe(writeNew)

// read.on('data', (chunk) => {
//     console.log(chunk.toString())
//     writeNew.write(Buffer.from(chunk))
// })

// process.on("exit", () => {
//     console.log("Process has been terminated" )
// })

// process.argv.forEach((arg, index) => {
//     console.log(`arg for ${arg} : ${index}`)
// })


// console.log(process.env)

