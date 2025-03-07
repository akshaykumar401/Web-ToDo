import { Router } from "express";
import {
  signup,
  login,
  logout,
  findUser,
  conformUser,
  changePass
} from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Route for Rendering The index.ejs Page.
router.get('/', (req, res) => {
  res.render('Login');
});

router.post("/login", async (req, res) => {
  await login(req, res)
});

router.get("/signup", (req, res) => {
  res.render("Signup")
});

router.post("/create", async (req, res) => {
  await signup(req, res)
});

router.get("/forgetpassword", (req, res) => {
  res.render("forgetpassword");
});

router.post("/find", async (req, res) => {
  await findUser(req, res)
});

router.get("/changepass/:id", async (req, res) => {
  await conformUser(req, res)
})

router.post("/changePass/:id", async (req, res) => {
  await changePass(req, res);
})

router.get("/logout", verifyJWT, async (req, res) => {
  await logout(req, res)
})

export default router;
