import mongoose from 'mongoose';

const dbConnection = () => {
    const MONGO_URI = process.env.MONGO_URI as string;
    try {
        mongoose.connect(MONGO_URI, {
            dbName: "BlogExpress",
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
};

export default dbConnection;