import mongoose, { Schema } from "mongoose";

const todoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    title: {
      type: String,
      require: [true, "Title is Require"]
    },
    content: {
      type: String,
    },
    backgroundColor: {
      type: String,
      default: "#C5BAFF"
    }
  },
  {
    timestamps: true
  }
);

export const Todo = mongoose.model("Todo", todoSchema);
