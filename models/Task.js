const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

module.exports = mongoose.model("Task", TaskSchema);
