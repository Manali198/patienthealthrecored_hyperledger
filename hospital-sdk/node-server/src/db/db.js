import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Db connected");
  })
  .catch((e) => {
    console.log(e);
  });
