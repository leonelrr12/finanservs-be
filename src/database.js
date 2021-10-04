import mongoose from "mongoose";
import cnnMDB from "./utils/config";

(async () => {
  try {
    const db = await mongoose.connect(cnnMDB.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("Mongodb is connected to", db.connection.host);
  } catch (error) {
    console.error(error);
  }
})();