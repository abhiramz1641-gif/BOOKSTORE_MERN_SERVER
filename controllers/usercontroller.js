
// import users
const users = require("../models/userModal")

// import jwt 
const jwt= require('jsonwebtoken')


exports.registerController = async (req, res) => {
    // logic
    const { username, email, password } = req.body
    console.log(username, email, password);

    // errr handling
    try {

        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(400).json("Already registered user..")
        } else {
            const newUser = new users({
                username, email, password
            })
            await newUser.save() //save to mongodb
            res.status(200).json(newUser)
        }

    } catch (err) {
        res.status(500).json(err)

    }
}


exports.loginController = async (req, res) => {
    // logic
    const { email, password } = req.body
    console.log(email, password);

    // errr handling
    try {

        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                // JWT encryption 
                const token=jwt.sign({userMail:existingUser.email},"secretKey")
                res.status(200).json({existingUser,token})
            } else {
                res.status(200).json("Password does not match")

            }
        } else {
            res.status(200).json("User does not exist")
        }

    } catch (err) {
        res.status(500).json(err)

    }



}