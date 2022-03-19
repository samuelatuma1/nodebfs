const http = require("http")
const fs = require("fs")
const { ContentType } = require("./utils")
const { home, addUser, signIn, postSignIn, userHomePage, showhomepage, searchFriends } = require("./controller.js")
const server = http.createServer((req, res) => {
    
    if(req.url === '/'){
        
        // console.log( ContentType('.json'))
        return home(req, res)
    }
    else if(req.url === '/addUser' && req.method === 'POST'){
        return addUser(req, res)
    }

    else if (req.url === '/signin' && req.method === 'GET') {
        return signIn(req, res)
    }
    else if(req.url === '/signin' && req.method === "POST"){
        return postSignIn(req, res)
    }
    else if (req.url === '/homepage'){
        return showhomepage(req, res)
        return userHomePage(req, res)
    }
    else if (req.url.match(/\/searchFriends\?data=[a-zA-Z]/)){
        
        return searchFriends(req, res)
    }
})

const PORT = process.env.PORT || 8000

server.listen(PORT , () => {console.log(`Listening on port ${PORT}`)})