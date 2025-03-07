import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
app.use(cors({
  origin: process.env.CORE_ORIGEN,
  Credential: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");

// Route Import.
import userRouter from "./routes/user.routes.js";
import dashboardRoute from "./routes/dashboard.routes.js";


// Route Declaration.
app.use("/", userRouter);
app.use("/user", dashboardRoute);




export { app }