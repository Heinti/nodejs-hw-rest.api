const app = require("./app");
const mongoose = require("mongoose");

const {DB_HOST} = process.env

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

mongoose
  .connect(DB_HOST)
  .then(app.listen(3000), 
  console.log("Database connection successful"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
