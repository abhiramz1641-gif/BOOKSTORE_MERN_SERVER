// import express
const express=require("express")

// import userController
const userController=require("./controllers/usercontroller")
const bookController=require("./controllers/bookController")

// import middleware
const jwtMiddleware=require('./middleware/jwtMiddleware')
const multerConfig = require("./middleware/multerMiddleware")
const jwtAdminMiddleware = require("./middleware/jwtAdminMiddleware")

// instance
const route=new express.Router()


route.post("/register",userController.registerController)

route.post("/login",userController.loginController)

route.post("/google-login",userController.googleLoginController)

route.get("/home-books",bookController.getHomeBookController)




// .........user.............

route.post("/add-book",jwtMiddleware,multerConfig.array("uploadImg",3),bookController.addBookController)

route.get("/all-books",jwtMiddleware,bookController.getAllBooks)

route.get("/view-book/:id",bookController.getABook)

route.put("/user-profile-update",jwtMiddleware,multerConfig.single("profile"),userController.editUserProfileController)

route.get("/user-added-books",jwtMiddleware,bookController.getAllBooksByUser)

route.get("/user-brought-books",jwtMiddleware,bookController.getAllBooksBroughtByUser)

route.delete("/delete-book/:id",bookController.deleteABookController)




// .........admin........

route.get("/admin-all-books",jwtAdminMiddleware,bookController.getAllAdminBooks)

route.put("/approve-books",jwtAdminMiddleware,bookController.approveBookController)

route.get("/all-users",jwtAdminMiddleware,userController.getAllUsersController)

route.put("/admin-profile-update",jwtAdminMiddleware,multerConfig.single("profile"),userController.adminUpdateProfileController)




module.exports=route
