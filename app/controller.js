const path = require("path")
const fs = require("fs")

const { ContentType, loadData, setSession, getSession, usePath } = require("./utils")
const { addUserData, getUserOr404, userDetails, friendsMatch, follow, updateUserStatus, fetchFriendsData, reactToStatus } = require("./models")

html_files = path.join(__dirname, 'templates')


const home = (req, res) => {
    const filePath = path.join(html_files, 'index.html')
    fs.readFile(filePath, {"encoding" : "utf8"}, (err, body) => {
        if(err) throw err;
        res.writeHead(200, {"Content-Type" : ContentType(path.extname(filePath))})
        res.end(body);
    })
}

const addUser = async (req, res) => {
    const jsonData = await loadData(req)
    const dbRes = await addUserData(jsonData)
    // console.log(dbRes)
    res.writeHead(201, {"Content-Type" : "text/plain"})
    res.end(dbRes)

}

const signIn = (req, res) => {
    fs.readFile(path.join(html_files, "signin.html"), {"encoding" : "utf8"}, (err, file) => {
        
        res.writeHead(200, {"Content-Type" : "text/html"})
        res.end(file)
    })

}
const postSignIn = async (req, res) => {
    const userData =  await loadData(req)
    const response = await getUserOr404(userData)
    console.log(response)
    if (response === "Successfully signned In"){ 
        loggedInUser = JSON.parse(userData)
        const setSessionData = await setSession("signedIn", loggedInUser.username)
        
        res.end(JSON.stringify({"status_code" : 201, response}));}
    else{
        res.end(JSON.stringify({"status_code" : 300, response}));
    }
}

const userHomePage = async (req, res) => {
    
    
    const username = await getSession('signedIn')
    const signedInUser = await userDetails(username)
    console.log(signedInUser)
    
}

const showhomepage = async (req, res) => {
    const fileData = await usePath(path.join(__dirname, 'templates',  'homepage.html'))
    res.writeHead(200, {"Content-Type" : "text/html"})
    res.end(fileData)
}

const searchFriends = async (req, res) => {
    const dataList = req.url.split('?data=')
    const searchData = dataList[dataList.length - 1]
    const matches = await friendsMatch(searchData)
    console.log(matches)
    res.end(matches)
    
}

const addFriend = async (req, res) => {
    const dataList = req.url.split('?friend=')
    const friendName = dataList[dataList.length - 1]
    const signedIn = await getSession('signedIn')
    const followUser = await follow(signedIn, friendName)
    console.log(followUser)
    res.writeHead(200, {"Content-Type" : "text/plain"})
   
    res.end(followUser)
}

const updateStatus = async (req, res) => {
    const jsonStatus  = await loadData(req)
    const signedIn = await getSession("signedIn")
    console.log(jsonStatus, signedIn)
    const statusRes = await updateUserStatus(jsonStatus, signedIn)
    res.end(statusRes)
}

const fetchFriends = async (req, res) => {
    const signedIn = await getSession('signedIn')
    const friendsList = await fetchFriendsData(signedIn)
    res.writeHead(200, {"Content-Type" : "application/json"})
    res.end(friendsList)
    console.log("Friends Added")
}

const reaction = async (req, res) => {
    const data = await loadData(req)
    const signedIn = await getSession("signedIn")
    
    const statusReaction = await reactToStatus(data, signedIn)
    
    res.end(data)
}

module.exports = { home, addUser, signIn, postSignIn, userHomePage, showhomepage, searchFriends, addFriend, updateStatus , fetchFriends, reaction }