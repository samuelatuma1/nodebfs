const session = require("./data/session.json")
const fs = require("fs")
const path = require("path");
const { resolve } = require("path");
function ContentType(extName){
    let ctype;
    let ext = extName;
    switch (ext){
        case '.json':
            ctype = "application/json"
            break;
        case '.css':
            ctype = "text/css"
            break;
        case ".html":
            ctype = "text/html"
            break;
        
        case ".js":
            ctype = 'text/javascript';
            break
        default:
            ctype = "text/html"    
    }
    return ctype
}
/**
 * 
 * @param {Object} req  : The request object
 * @returns A promised JSONresponse of the post or put data
 */
const loadData =  (req)  => {
    const promisedData = new Promise((resolve, reject) => {
        let body = ''
        req.on("data", (Chunk) => {
            body += Chunk.toString()
        })

        req.on("end", () => {
            resolve(body)
        })
    })
    return promisedData
}
/**
 * 
 * @param {String} key String Data representing key to be added to Session 
 * @param {*} val  Any Data Type that serves as the value to the key in Session
 * @returns a promise object 
 */
const setSession = (key, val) => {
    const promise = new Promise((resolve, reject) => {
        // const session = JSON.parse(session)
       
        session[key] = val
        fs.writeFile(path.join(__dirname, 'data', 'session.json'), JSON.stringify(session), {"encoding" : "utf8"}, (err) => {
            if(err) console.log(err);
            
            console.log(`${key} session added ssuccessfully`)
            return resolve(`${key} session added ssuccessfully`)
        })
    })
    return promise
}
/**
 * 
 * @param {String} key The key to whose value we wish to access
 * @returns a promise either with the value of the key in  session or null
 */
const getSession = (key) => {
    const promise = new Promise ((resolve, reject) => {
        const promised_data = session[key]
        if(promised_data){
            return resolve(promised_data)
           
        }
        return resolve(null)
    })
    return promise
}

/**
 * 
 * @param {Object} req The request object from http
 * @param {Object} res The respomse object from http
 * @param {String} filePath The path to the file to read
 * @returns a Promise containning the data from the file to be read
 */
const usePath = (filePath) => {
    const promise = new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) console.log(err)
           return  resolve(data)
        })
    })

    return promise
}
module.exports = { ContentType, loadData, setSession, getSession, usePath}