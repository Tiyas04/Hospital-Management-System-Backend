import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        await mongoose.connect(`${process.env.DATABASE_URL}/database`)
    } catch (error) {
        console.log("Error:", error.message || "Unable to connect to the database")
    }
}

export default connectDB