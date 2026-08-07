const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    "https://beavers-bar.ru",
    "https://www.beavers-bar.ru",
    "http://localhost:5173",
  ],
  credentials: true,
};

const serverConfig = (app) => {
  app.use(cors(corsOptions));

  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  app.use(morgan("dev"));

  app.use(cookieParser());

  app.use(
    "/static/images",
    express.static(path.resolve(__dirname, "..", "public", "images"))
  );
};

module.exports = serverConfig;
