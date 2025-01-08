import mongoose from "mongoose";




export const connectToDb = async (connectionString: string) => {
    try {
       const connect = await mongoose.connect(connectionString)
       if(!connect){
        console.error("Unable to connect to DB")
       }
    }
    catch (error){
        console.error("Error while attempting to connect to the db", error)
    }
}