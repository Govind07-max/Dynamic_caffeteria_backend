import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
const connectDB = asyncHandler(async () => {
try {
    const connect = await mongoose.connect(process.env.DB_CONNECTION_STRING)
        

    console.log("database conneccted: ", connect.connection.name);
    
    
} catch (error) {
    
    throw new Error("failed to cnnect to the database")

}
})

export {connectDB}