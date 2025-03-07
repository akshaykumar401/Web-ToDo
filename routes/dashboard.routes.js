import { Router } from "express";
import {
  createToDo,
  deleteToDo,
  editDetails,
  uploadProfilePicture,
  updateTodo
} from "../controllers/dashboard.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { User } from "../models/users.model.js";
import { Todo } from "../models/todos.model.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.get("/dashboard", verifyJWT, async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    return res.render("error", { 
      code: 404, 
      message: "User not found" 
    });
  }
  const todo = await Todo.find({owner: id});
  res.render("dasboard", { user, todo });
});

router.post("/create-todo", verifyJWT, async (req, res) => {
  await createToDo(req, res)
});

router.get("/delete/:id", verifyJWT, async (req, res) => {
  await deleteToDo(req, res)
})

router.get("/updatedetail", verifyJWT, async (req, res) => {
  const id = req.user.id;
  const user = await User.findById(id).select("-password -refreshToken");
  res.render("updateAccountDetail", { user });
})

router.post("/updateDetail", verifyJWT, async (req, res) => {
  await editDetails(req, res)
})

router.get("/change-avatar", verifyJWT, async (req, res) => {
  res.render("changeAvatar")
})

router.post("/change-avatar", verifyJWT, upload.single("avatar") , async (req, res) => {
  await uploadProfilePicture(req, res)
})

router.get("/edit/:id", verifyJWT, async (req, res) => {
  const id = req.params.id;
  const todo = await Todo.findById(id);

  return res.render("editTodo", { todo, id })
})

router.post("/updateTodo/:id", verifyJWT, async (req, res) => {
  await updateTodo(req, res)
})

export default router;