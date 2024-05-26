const express = require("express");
const app = express();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const connectDB = require("./config/db");
const config = require("config");
const db = config.get("mongoURI");
const bycrpt = require("bcryptjs");
const User = require("./models/User");
const isAuthorized = require("./middleware/isAuth");
const isAuth = require("./middleware/isAuth");

connectDB();

const store = new MongoDBSession({
  uri: db,
  collection: "mysessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "sandeep putta",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.get("/", function (req, res) {
  res.render("landing");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.redirect("/register");
  }

  const isMatch = await bycrpt.compare(password, user.password);

  if (!isMatch) {
    return res.redirect("/login");
  }

  req.session.isAuth = true;
  res.redirect("/dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    res.redirect("/register");
  }

  const hashedPassword = await bycrpt.hash(password, 12);

  user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();

  res.redirect("/login");
});

app.get("/dashboard", isAuth, (req, res) => {
  res.render("dashboard");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.listen(5000, console.log("server is listening on port 5000"));
