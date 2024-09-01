import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/Task_Mangement_App`)
        console.log(`Connected to MongoDB!!! DB HOST: ${conn.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection error ", error)
        process.exit(1)
    }
}

export default connectDB;