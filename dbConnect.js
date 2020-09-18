require('dotenv').config();
const mongoose = require('mongoose');

const { DB_NAME, DB_LOGIN, DB_PASS } = process.env;
const dbUrl = `mongodb+srv://${DB_LOGIN}:${DB_PASS}@cluster0.f3yi0.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const dbConnect = () => {
  mongoose.connect(
    dbUrl,
    { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
    (err) => {
      if (err) throw err;
      console.log('DB connection success');
    }
  );
};

module.exports = dbConnect;
