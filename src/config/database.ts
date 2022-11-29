import * as mongoose from "mongoose";

export const connect = () => {
  // Connecting to the database
  const { MONGO_URI } = process.env;
  return mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.log(MONGO_URI);
      console.error(error);
      process.exit(1);
    });
};
