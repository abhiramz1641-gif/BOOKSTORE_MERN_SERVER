// import express
const express=require("express")

// import userController
const userController=require("./controllers/usercontroller")
const bookController=require("./controllers/bookController")

// import middleware
const jwtMiddleware=require('./middleware/jwtMiddleware')
const multerConfig = require("./middleware/multerMiddleware")

// instance
const route=new express.Router()


route.post("/register",userController.registerController)

route.post("/login",userController.loginController)

route.post("/google-login",userController.googleLoginController)

route.post("/add-book",jwtMiddleware,multerConfig.array("uploadedImage",3),bookController.addBookController)


module.exports=route
