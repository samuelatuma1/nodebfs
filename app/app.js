const http = require("http")
const fs = require("fs")
const { ContentType } = require("./utils")
const { home, addUser, signIn, postSignIn, userHomePage, showhomepage, searchFriends, addFriend, updateStatus, fetchFriends, reaction, BFSSkll} = require("./controller.js")
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
        
    }
    else if (req.url.match(/\/searchFriends\?data=[a-zA-Z0-9]/)){
        
        return searchFriends(req, res)
    }

    else if(req.url.match(/\/addFriend\?friend=[a-zA-Z0-9]/)){
       
        return addFriend(req, res)
    }
    else if(req.url === `/updateStatus` && req.method === 'PUT'){
        return updateStatus(req, res)
    }
    else if (req.url === '/fetchFriends' && req.method === 'GET'){
        res.writeHead(200, {"Content-Type" : "application/json"})
        fetchFriends(req, res)
        
    }
    else if(req.url === '/react' && req.method === 'POST'){
        console.log("Seen friends Reaction")
        return reaction(req, res)
    }

    else if(req.url === '/searchSkill' && req.method === 'POST'){
        return BFSSkll(req, res)
    }
    else{
        res.writeHead(404, {"Content-Type" : "text/html"})
        const readPage = fs.createReadStream(__dirname + '/templates/404.html')
        readPage.pipe(res)
    }
})

const PORT = process.env.PORT || 8000

server.listen(PORT , () => {console.log(`Listening on port ${PORT}`)})