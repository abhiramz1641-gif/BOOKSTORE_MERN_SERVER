// import env
const mongose =require("mongoose")

const connectionString=process.env.DATABASE

mongose.connect(connectionString).then(()=>{
    console.log("mongoDB connected");
    
}).catch((err)=>{
    console.log("connection failed");
    console.log(err);
    
    
})