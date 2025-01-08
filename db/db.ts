import mongoose from "mongoose";



/**
 * 
 * @param connectionString - The mongoDB uri connection string
 * @returns A Promise that resolves when the connection is successful
 * 
 */
export const connectToDb = async (connectionString: string): Promise<void> => {
    try {
       const connect = await mongoose.connect(connectionString)
       if(!connect){
        console.error("Unable to connect to DB")
       }
       console.log("Successfully connected to the database")
    }
    catch (error){
        console.error("Error while attempting to connect to the db", error)
    }
}