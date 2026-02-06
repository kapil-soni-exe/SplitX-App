const mongoose= require("mongoose")

async function  connectToDb(){
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("Connect to DB")
    })
}

module.exports= connectToDb