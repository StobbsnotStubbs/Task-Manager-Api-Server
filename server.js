"use strict";
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema({
  taskTitle: String,
  user: String,
  dueDate: String,
  priorityLevel: String,
  description: String,
  status: { type: String, default: "pending" },
  timeStamp: { type: String, default: Date.now() },
});

const taskModel = mongoose.model("task", taskSchema);

mongoose
  .connect("mongodb://127.0.0.1:27017/taskmanager")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// Routes/Endpoints
app.get("/", homeHandler);
const error404 = require("./handlers/404");
const error500 = require("./handlers/500");
app.post("/taskmanager/add", addTaskHandler);

// Routes Handlers
function homeHandler(request, response) {
  response.send("Hello world!");
}

async function addTaskHandler(req, res) {
  try {
    const { taskTitle, user, dueDate, priorityLevel, description } = req.body;

    let newTask = await taskModel.create({
      taskTitle,
      user,
      dueDate,
      priorityLevel,
      description,
    });
    return res.status(200).send(newTask);
  } catch (error) {
    res.status(400).send("Task not created");
  }
}

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
