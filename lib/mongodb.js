import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Conn to MongoDB succ")
    }catch(error){
        console.log("Error conn to Mongo", error)
    }
}