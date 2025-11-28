const appMiddleware=(req,res,next)=>{

    console.log("inside middleware");
    next()
    
}

module.exports=appMiddleware