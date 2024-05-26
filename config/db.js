const mongoose = require("mongoose");
const config = require("config");
const express = require("express");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log("error occured while connecting to mongo");
    process.exit(1);
  }
};

module.exports = connectDB;
