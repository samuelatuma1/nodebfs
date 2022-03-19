const users = require("./data/users.json")
const fs = require("fs")
const path = require("path")
const { ContentType, loadData, setSession, getSession, usePath} = require("./utils")
const { resolve } = require("path")
const { fileURLToPath } = require("url")
const { resolveSoa } = require("dns")

/**
 * 
 * @param {String} jsonUser : JSON representation of the user data to add to users
 * @returns {String} "user created or "User Already exists"
 */
const addUserData = (jsonUser) => {
    return new Promise((resolve, reject) => {
        const curr_user = JSON.parse(jsonUser)
        if(!users.hasOwnProperty(curr_user.username)){
            users[curr_user.username] = {...curr_user, followers : [],  status : {status : "Hey, I use bfs", likes : {}}}

            fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users), (err) => {
                console.log("File written to")
                resolve("User Created")
            })
        }
        else{
            resolve("User Already Exists!")
        }
        
    })

    
}

/**
 * @param {String} jsonData : -> jsonData Object representing the username and password
 * @returns a promise {String} which is either "Invalid Username" or "Successfully signned In" or   resolve("Password Incorrect")
 */
const getUserOr404 = async (jsonData) => {
    return new Promise((resolve, reject) => {
        const userObject = JSON.parse(jsonData)
        const username = userObject.username
        if(!users.hasOwnProperty(username)){
            resolve("Invalid Username")
        }
        else{
            if(users[username].password == userObject.password){
                resolve("Successfully signned In")
            }
            else{
                resolve("Password Incorrect")
            }
        }
    })
    
}


const userDetails = (username) => {
    const promise = new Promise((resolve, reject) => {
        console.log(users[username])
        console.log(username)
        resolve(users[username] || {})
    })
    return promise
}

const friendsMatch = async (username) => {
    const signedIn = await getSession('signedIn')

    const allFriends = new Promise((resolve, reject) => {

        const friendsMatch = []
        for(let item in users) {
            if(item === signedIn){
                continue
            }
            if (item.includes(username)){
                friendsMatch.push(item)
            }
        }

        resolve(JSON.stringify(friendsMatch))
    })
    return allFriends
}

const follow =  (signedIn, friend) => {
    return new Promise((resolve, reject) => {
        const signedInUser = users[signedIn] || null
      
        if(!signedInUser ){
            return resolve("Err, No user found")
        }
        const userFollowers = new Set(signedInUser.followers)
        userFollowers.add(friend)
        signedInUser.followers = Array.from(userFollowers)
        users[signedIn] = signedInUser
        
        fs.writeFile(__dirname + '/data/users.json', JSON.stringify(users), (err) => {
            if(err) console.log(err);
            resolve('User friend Added To List')
        })
        
    })
}
/**
 * 
 * @param {Object} newStatus : JSON representation of newStatus
 * @param {String} signedIn : String Representation of signed in user
 * @returns {Promise} Promise Status Updated successfully or error
 */
const updateUserStatus = (newStatus, signedIn) => {
    const status = JSON.parse(newStatus)
    const promise = new Promise((resolve, reject) => {
        if(signedIn) {
            users[signedIn].status = {
                status: status.newStatus,
                likes: {signedIn : signedIn}
            }

            fs.writeFile(__dirname + '/data/users.json', JSON.stringify(users), (err) => {
                if(err) resolve(err)
                resolve("Status updated Successfully")
            })
        }
    })
    return promise
}
/**
 * 
 * @param {String} username : -> Username of who is signed In
 * @returns {Promise} :-> A list of objects containing friends details 
 */
const fetchFriendsData = (username) => {
    return new Promise ((resolve, reject) => {
        if(!username) resolve(JSON.stringify([]))
        const friendsData = users[username].followers
        // console.log(friendsData)
        const details = friendsData.map(username => users[username])
        resolve(JSON.stringify(details))
    
    })

}

const reactToStatus = (reaction, signedIn) => {
    return new Promise((resolve, reject) => {
        const userReaction = JSON.parse(reaction)
        const reactingTo = userReaction.user.username
        const reactionStatus = userReaction.liked
        console.log(reactionStatus)
        if (reactionStatus){
            
            console.log(users[reactingTo])
            if(users[reactingTo].status.likes) users[reactingTo].status.likes[signedIn] = 1
            else{
                users[reactingTo].status.likes = {
                    
                } 
                users[reactingTo].status.likes[signedIn] = 1
            }

        }
        else{
            if (users[reactingTo].status.likes) delete users[reactingTo].status.likes[signedIn]
        }

        fs.writeFile(__dirname + '/data/users.json', JSON.stringify(users), (err) => {
            if (err) console.log(err)
            console.log("Reaction Uploaded")
        })

        resolve("Reaction Uploaded")
        // console.log(users[reactingTo].status.likes)
    })
    
}
module.exports = { addUserData, getUserOr404, userDetails, friendsMatch, follow, updateUserStatus, fetchFriendsData, reactToStatus}