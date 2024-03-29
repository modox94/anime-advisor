const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const hbs = require("hbs");
const mongoConnect = require("./db/mongo.js");
const userMiddleware = require("./src/middleware/user");
const indexRouter = require("./src/routes/index.js");
const signupRouter = require("./src/routes/signup.js");
const signinRouter = require("./src/routes/signin.js");
const signoutRouter = require("./src/routes/signout.js");
const searchRouter = require("./src/routes/search.js");
const recommendRouter = require("./src/routes/recommend.js");

const app = express();

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.set("session cookie name", "sid");
hbs.registerPartials(path.join(__dirname, "views", "partials"));
app.set("trust proxy", 1);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoConnect().then((client) => {
  app.use(
    session({
      name: app.get("session cookie name"),
      secret: process.env.SECRET_KEY,
      store: MongoStore.create({ client }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      },
    })
  );
});

app.use(userMiddleware);
app.use("/", indexRouter);

app.use("/signup", signupRouter);
app.use("/signin", signinRouter);
app.use("/signout", signoutRouter);
app.use("/search", searchRouter);
app.use("/recommend", recommendRouter);

app.listen(process.env.PORT || 3000, (err) => {
  if (err) throw err;
  console.log(`Server listening on port ${process.env.PORT}`);
});
