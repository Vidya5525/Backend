import mongoose from "mongoose";

const dbconnection = () =>{
    mongoose.connect(process.env.MONGO_URL , {
        dbName:"HOSPITAL_MANAGEMENT_DATABASE"
    })
    .then(()=>console.log("Mongodb connected successful"))
    .catch((err)=>console.log(`some error occured while connecting database ${err}`))
}

export default dbconnection ;