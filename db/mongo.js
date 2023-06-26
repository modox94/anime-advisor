const mongoose = require("mongoose");

const { DB_NAME, DB_LOGIN, DB_PASS } = process.env;
const dbUrl = `mongodb+srv://${DB_LOGIN}:${DB_PASS}@cluster0.f3yi0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const dbConnect = async () => {
  const connection = await mongoose
    .createConnection(
      dbUrl,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err) => {
        if (err) throw err;
        console.log("DB connection success");
      }
    )
    .asPromise();

  return connection.getClient();
};

module.exports = dbConnect;
