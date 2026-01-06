require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
const mongoose = require("mongoose");
const Task = require("./models/Task.js");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("App is live");
});

//create a task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true },
    );
    res.status(200).json(updatedTask);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ message: "Task deleted successfully", task: deletedTask });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });
