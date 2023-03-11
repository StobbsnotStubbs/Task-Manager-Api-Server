"use strict";
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/taskmanager")
.then(()=>console.log("DB Connected"))
.catch((err)=>console.log(err))

// Routes/Endpoints
app.get("/", homeHandler);
const error404 = require("./handlers/404");
const error500 = require("./handlers/500");

// Routes Handlers
function homeHandler(request, response) {
  response.send("Hello world!");
}

app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`listening on ${PORT}`));