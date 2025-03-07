import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Todo } from "../models/todos.model.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";

// Create The ToDo
const createToDo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.render("error", {
      code: 401,
      message: "Unauthorized User"
    });
  }
  const { title, content, color } = req.body;
  // Validating is Title and Content are provided
  if (!title || !content) {
    return res.render("error", {
      code: 401,
      message: "Fill All The Fields"
    });
  }
  // Creating a new ToDo
  const newToDo = await Todo.create(
    {
      title: title,
      content: content,
      backgroundColor: color,
      owner: userId
    }
  );

  const user = await User.findById(userId);
  user.todos.push(newToDo._id);
  user.save()

  return res
    .status(200)
    .redirect("/user/dashboard")
})

// Delete The ToDo
const deleteToDo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;
  if (!userId) {
    return res.render("error", {
      code: 401,
      message: "Unauthorized User"
    });
  }

  const todo = await Todo.findByIdAndDelete({_id: id});
  const user = await User.findById(userId);
  user.todos.pull(id);
  user.save()

  return res
    .status(200)
    .redirect("/user/dashboard")
})

// edit user -> Username & Fullname
const editDetails = asyncHandler(async (req, res) => {
  const id = req.user._id;
  if( !id ) {
    return res.render("error", {
      code: 401,
      message: "Unauthorized User"
    });
  }
  const { fullname, username } = req.body;
  if( !fullname && !username ) {
    return res.render("error", {
      code: 400,
      message: "Please fill in the form"
    });
  }

  const isSameUserName = await User.findOne({ username });
  if( isSameUserName ) {
    return res.render("error", {
      code: 400,
      message: "Username already exists"
    });
  }

  const user = await User.findById(id)
  if( !user ) {
    return res.render("error", {
      code: 404,
      message: "User not found"
    });
  }
  user.fullname = fullname
  user.username = username
  user.save()

  return res
  .status(200)
  .redirect("/user/dashboard")
})

// Upload Profile Picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
  const id = req.user._id;
  if( !id ) {
    return res.render("error", {
      code: 401,
      message: "Unauthorized User"
    });
  }
  const avatorLocalPath = req.file.path;
  if( !avatorLocalPath ) {
    return res.render("error", {
      code: 400,
      message: "Please upload a file"
    });
  }

  const avatar = await uploadOnCloudnary(avatorLocalPath);
  if( !avatar.url ) {
    return res.render("error", {
      code: 400,
      message: "Failed to upload image"
    });
  }
  
  const user = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    { new: true }
  ).select("-password -refreshToken")

  return res
  .status(200)
  .redirect("/user/dashboard")
})

// Update Todo
const updateTodo = asyncHandler(async (req, res) => {
  const { title, content, color } = req.body
  const id = req.params.id;
  
  if( !title && !content ) {
    return res.render("error", {
      code: 400,
      message: "Please fill in the title and content"
    });
  }
  const todo = await Todo.findByIdAndUpdate(
    id,
    {
      $set: {
        title: title,
        content: content,
        backgroundColor: color
      }
    },
    { new: true }
  )

  return res
  .status(200)
  .redirect("/user/dashboard")
})

export {
  createToDo,
  deleteToDo,
  editDetails,
  uploadProfilePicture,
  updateTodo
}