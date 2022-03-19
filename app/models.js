const users = require("./data/users.json")
const fs = require("fs")
const path = require("path")

/**
 * 
 * @param {String} jsonUser : JSON representation of the user data to add to users
 * @returns {String} "user created or "User Already exists"
 */
const addUserData = (jsonUser) => {
    return new Promise((resolve, reject) => {
        const curr_user = JSON.parse(jsonUser)
        if(!users.hasOwnProperty(curr_user.username)){
            users[curr_user.username] = {...curr_user, followers : [],  status : "Hey, I use bfs"}

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

const friendsMatch = (username) => {
    const allFriends = new Promise((resolve, reject) => {
        const friendsMatch = []
        for(let item in users) {
            if (item.includes(username)){
                friendsMatch.push(item)
            }
        }

        resolve(JSON.stringify(friendsMatch))
    })
    return allFriends
}
module.exports = { addUserData, getUserOr404, userDetails, friendsMatch}