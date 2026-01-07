require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT ?? 3000;
const mongoose = require("mongoose");
const Task = require("./models/Task.js");
const cors = require("cors");

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const allowedPatterns = [
        /^http:\/\/localhost:\d+$/, // Any local port
        /^https:\/\/.*\.bionaraq\.info$/, // Any subdomain of your site
      ];
      const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`); // Helpful for debugging
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
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

//patch to update isCompleted
app.patch("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { isCompleted: req.body.isCompleted },
      { new: true },
    );
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
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

console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });
