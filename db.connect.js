import mongoose from "mongoose";

const dbUsername = process.env.DB_USER_NAME;
const dbPassword = encodeURIComponent(process.env.DB_PASSWORD);
const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;

const dbURL = `mongodb+srv://${dbUsername}:${dbPassword}@${databaseHost}/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("DB connection established...");
  } catch (error) {
    console.log(error.message);
    console.log("DB connection failed...");
  }
};

export default connectDB;
