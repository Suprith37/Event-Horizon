// import mongoose from "mongoose";

// const connectDB = async () => {
//   const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsdb";
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   });
//   console.log("MongoDB connected");
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsdb";

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
