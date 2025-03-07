import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudnary } from "../utils/cloudnary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/users.model.js";


// generateAccessAndRefereshTokens Function
const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }

  } catch (error) {
    return res.render("error", { 
      code: 500, 
      message: "SomeThing Went Wrong While Generating Access and Rreferesh Token" 
    });
  }
}


// Signup The User...
const signup = asyncHandler(async (req, res) => {
  const { Fullname, username, email, password } = req.body;

  // Validation is all Detail is Filled or Not
  if( !Fullname && !username && !email && !password ) {
    return res.render("error", { 
      code: 404, 
      message: "All Field are Required" 
    });
  }

  // Validating is User already exist...
  const existEmail = await User.findOne({ 
    email
  });
  if(existEmail) {
    return res.render("error", { 
      code: 400, 
      message: "You Have Allreaddy an Account!" 
    });
  }
  // Validating is username already exist...
  const existUsername = await User.findOne({
    username
  });
  if(existUsername) {
    return res.render("error", { 
      code: 400, 
      message: "UserName is Allready Taken!" 
    });
  }

  // Creating User..
  const user = await User.create({
    fullname: Fullname,
    username: username.toLowerCase(),
    email: email,
    password: password
  });

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.id);
  
  // Removing Password and refresh Token from Response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )
  if( !createdUser ) {
    return res.render("error", { 
      code: 500, 
      message: "SomeThing Went Wrong!" 
    });
  }
  
  // Previnting From Frontend Attack.
  const option = {
    httpOnly: true,
    secure: true,
  }
  
  // Return Response
  return res
  .status(200)
  .cookie("accessToken", accessToken, option)
  .cookie("refreshToken", refreshToken, option)
  .redirect("/user/dashboard");
});

// Login The User...
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validating is Email or Password is Given
  if(!email && !password) {
    return res.render("error", { 
      code: 404, 
      message: "Email or Password is Required!" 
    });
  }

  // Validating is Email is Valid
  const user = await User.findOne({email});
  if(!user) {
    return res.render("error", { 
      code: 404, 
      message: "User Not Exist" 
    });
  }
  // if Email is Valide Then Cheak The Password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    return res.render("error", { 
      code: 404, 
      message: "Password is Incorrect!" 
    });
  }

  // Genrating Access and Refresh token.
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user.id);
  
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // Securing From Frontend
  const option = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, option)
  .cookie("refreshToken", refreshToken, option)
  .redirect("/user/dashboard")
});

// Logout User
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  // Proctecting From Frontend
  const option = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", option)
  .clearCookie("refreshToken", option)
  .redirect("/")
})

// find User For Forget Password...
const findUser = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  // Validating The User For Entring all The Data
  if(!username && !email) {
    return res.render("error", { 
      code: 401, 
      message: "Fill All Detail!" 
    });
  }

  const user = await User.findOne({
    $and: [{username}, {email}]
  }).select("-refreshToken");
  if(!user) {
    return res.render("error", { 
      code: 401, 
      message: "User Not Found!" 
    });
  }

  return res
  .status(200)
  .render("confromUser", {user})
})

// Conform The user...
const conformUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  // Validating The User ID
  if(!id) {
    return res.render("error", { 
      code: 401, 
      message: "Some Thing Went Wrong!" 
    });
  }

  return res
  .status(200)
  .render("changepassword", {id})
})

// Changing Password...
const changePass = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // Validating The User ID
  if( !id ) {
    return res.render("error", { 
      code: 401, 
      message: "Some Thing Went Wrong!" 
    });
  }

  const user = await User.findById(id);
  if(!user) {
    return res.render("error", { 
      code: 401, 
      message: "User Not Found!" 
    });
  }
  const { newPassword, conformPassword } = req.body;

  // Validating The User For Entring all The Data
  if( !newPassword && !conformPassword) {
    return res.render("error", { 
      code: 401, 
      message: "Fill All Detail!" 
    });
  }

  // Matching Both Password is Same or Not
  if(newPassword !== conformPassword) {
    return res.render("error", { 
      code: 404, 
      message: "Password Not Match!" 
    });
  }

  user.password = newPassword;
  await user.save({validateBeforeSave: false});
  
  return res
  .status(200)
  .redirect("/");
})


export {
  signup,
  login,
  logout,
  findUser,
  conformUser,
  changePass
}