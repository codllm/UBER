const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const cookiePaerse = require('cookie-parser');
const app = express();



const userRoutes = require("./routes/user.routes");

const captionRoutes = require('./routes/caption.routes')



app.use(cookiePaerse());

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("hello nishant");
});

// routes
app.use("/users", userRoutes);
app.use('/captions',captionRoutes);

// db connect
// connectToDb();

module.exports = app;
