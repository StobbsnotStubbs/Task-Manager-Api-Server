"use strict";
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const taskSchema = new mongoose.Schema(
  {
    taskTitle: String,
    user: String,
    dueDate: String,
    priorityLevel: String,
    description: String,
    status: { type: String, default: "pending" },
  }
  //{ timestamps: true }
);

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
app.get("/taskmanager/get-tasks", getTaskHandler);
app.delete("/taskmanager/delete-tasks/:id", deleteTaskHandler);
app.put("/taskmanager/updateTask/:id", updateTaskHandler);
app.get("/taskmanager/getUsersTasks/:user", getUsersTasksHandler);

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

async function getTaskHandler(req, res) {
  let allTasks = await taskModel.find({});
  res.status(200).send(allTasks);
}

async function deleteTaskHandler(req, res) {
  const id = req.params.id;
  await taskModel.findByIdAndDelete(id);
  let allTasks = await taskModel.find({});
  res.send(allTasks);
}

async function getUsersTasksHandler(req, res) {
  let userId = req.params.user;
  let userTasks = await taskModel.find({ user: userId });
  res.send(userTasks);
}

async function updateTaskHandler(req, res) {
  const { taskTitle, user, dueDate, priorityLevel, description } = req.body;
  const id = req.params.id;
  await taskModel.findByIdAndUpdate(
    id,
    { taskTitle, user, dueDate, priorityLevel, description },
    { new: true, overwrite: true }
  );
  let allTasks = await taskModel.find({});
  res.send(allTasks);
}

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`listening on ${PORT}`));
