const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoUrl");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log("dataBase connected successfully...");
  } catch (error) {
    console.error(error);

    // Exit
    process.exit(1);
  }
};

module.exports = connectDB;
