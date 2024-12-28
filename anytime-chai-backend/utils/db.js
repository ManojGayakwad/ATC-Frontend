const mongoose = require("mongoose");

const URL = "mongodb+srv://gaykwadmanoj1998:ffs4ni1eyoubrkMG@cluster0.lgiul.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDB = async () => {
    try {
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Successfully connected to database");
    } catch (error) {
      console.error("Database connection failed", error);
      process.exit(1);
    }
  };

  module.exports = connectDB;