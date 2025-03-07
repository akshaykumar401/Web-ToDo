import 'dotenv/config'
import conectDB from "./config/conectDB.js";
import { app } from "./app.js";

conectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`⚙ Server is running on http://localhost:${process.env.PORT || 8000}`);
    })
  })
  .catch((error) => {
    console.log("MondoDB Connect Failed!!!", error);
  })